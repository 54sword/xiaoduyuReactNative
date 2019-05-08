import React, { Component } from 'react'
import { Text, View, Button, Alert, TouchableOpacity, PixelRatio, Platform } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

// import KeyboardSpacer from 'react-native-keyboard-spacer';
import { Toast } from 'teaset';

// redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getProfile } from '../../store/reducers/user';
// import { addComment, updateComment, loadCommentList } from '../../store/actions/comment';
import { addMessage } from '../../store/actions/message';

// components
import Editor from '../../components/editor';

// styles
import styles from './styles';

@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
    addMessage: bindActionCreators(addMessage, dispatch)
  })
)
export default class WriteComment extends React.Component {

  static navigationOptions = ({ navigation }) => {

    const { params = {} } = navigation.state;
    const { replyId, submit, submitting } = params;

    return {
      headerLeft: (<TouchableOpacity style={{padding:13,paddingLeft:15}} onPress={()=>navigation.goBack()}>
                    <Text style={{fontSize:16,fontWeight:'bold',color:'#484848'}}>取消</Text>
                  </TouchableOpacity>),
      title: '',
      headerRight: (<TouchableOpacity style={styles.button} onPress={()=>submit()}>
                    <Text style={styles.inactiveButtonText}>{submitting ? '发送中...': '发送'}</Text>
                   </TouchableOpacity>),
      headerStyle: {
        elevation: 0,
        backgroundColor: '#fff',
        borderBottomWidth: 1/PixelRatio.get(),
        borderColor:'#e7e9ec'
      }
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      content:'',
      cacheContentList: null,
      isMount: true,
      submitting: false
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  async componentDidMount() {

    const { me, navigation, loadCommentList } = this.props;
    const { addressee_id } = this.props.navigation.state.params;

    let content = '';

    AsyncStorage.getItem('comments-content', (errs, result)=>{

      if (!this.state.isMount) return;

      try {
        result = JSON.parse(result) || {}
      } catch (e) {
        result = {}
      }

      let content = result[addressee_id] || '';

      this.setState({
        content,
        cacheContentList: result
      });

      this.props.navigation.setParams({ submit: this.onSubmit });

    });

  }

  async onSubmit() {
    const result = this.getContent();
    const { addMessage, navigation } = this.props;
    const { addressee_id } = this.props.navigation.state.params;

    if (this.state.submitting) return;

    if (!result) return;
    if (result.loading) {
      Toast.info('图片未上传完成，请等待再提交...');
      return;
    }

    let err, res;

    this.state.submitting = true;
    this.props.navigation.setParams({ submitting: true });


      [ err, res ] = await addMessage({
        addressee_id: addressee_id,
        type: 1,
        content: result.json,
        content_html: result.html,
        device: Platform.OS == 'ios' ? 7 : 8
      });

      if (!err) {
        Toast.success('提交成功');
        navigation.goBack();

        if (this.state.cacheContentList[addressee_id]) {
          delete this.state.cacheContentList[addressee_id];
        }

        AsyncStorage.setItem('comments-content', JSON.stringify(this.state.cacheContentList), (errs, result)=>{});

      } else {
        Toast.fail(err.message || '提交失败');
      }

    this.state.submitting = false;
    this.props.navigation.setParams({ submitting: false });

  }

  onChange(content) {
    
    const { addressee_id } = this.props.navigation.state.params;

    if (content) {
      this.state.cacheContentList[addressee_id] = content;
    } else if (!content && this.state.cacheContentList[addressee_id]) {
      delete this.state.cacheContentList[addressee_id];
    }

  }

  componentWillUnmount() {

    this.state.isMount = false;

    // 如果是编辑器状态
    const { _id } = this.props.navigation.state.params;
    if (_id || !this.state.cacheContentList) return;

    let list = this.state.cacheContentList;

    // 只保留最新的10条草稿
    let index = [];
    for (let i in list) index.push(i);
    if (index.length > 5) delete list[index[0]];

    AsyncStorage.setItem('comments-content', JSON.stringify(list), (errs, result)=>{});
  }

  render() {

    const { content } = this.state;

    return (<View style={{flex:1}}>

      <Editor
        getContent={callback=>{
          this.getContent = callback;
        }}
        onChange={this.onChange}
        darftJSON={content}
        type="comment"
        />

    </View>)
  }
}
