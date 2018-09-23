import React, { Component } from 'react'
import { Text, View, Button, Alert, TouchableOpacity, PixelRatio, AsyncStorage, Platform } from 'react-native';
import { RNToasty } from 'react-native-toasty';
import KeyboardSpacer from 'react-native-keyboard-spacer';

// redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getProfile } from '../../reducers/user';
import { addComment, updateComment, loadCommentList } from '../../actions/comment';

// components
import Editor from '../../components/editor';

// styles
import styles from './styles';

@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
    addComment: bindActionCreators(addComment, dispatch),
    updateComment: bindActionCreators(updateComment, dispatch),
    loadCommentList: bindActionCreators(loadCommentList, dispatch)
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
      title: replyId ? '写回复' : '写评论',
      headerRight: (<TouchableOpacity style={styles.button} onPress={()=>submit()}>
                    <Text style={styles.inactiveButtonText}>{submitting ? '提交中...': '提交'}</Text>
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
    const { _id, posts_id, parent_id, reply_id } = this.props.navigation.state.params;

    // if (!me) {
      // navigation.navigate('Sign');
      // return;
    // }

    let content = '';

    // 编辑评论
    if (_id) {
      let [ err, res ] = await loadCommentList({
        name: 'edit_'+_id,
        filters: {
          query: { _id: _id },
          select: `
            content
            _id
          `
        },
        restart: true
      });

      if (!this.state.isMount) return;

      if (res && res.data && res.data[0]) {
        content = res.data[0].content;
      }

      this.setState({ content });

      this.props.navigation.setParams({ submit: this.onSubmit });

      return;
    }

    AsyncStorage.getItem('comments-content', (errs, result)=>{

      if (!this.state.isMount) return;

      try {
        result = JSON.parse(result) || {}
      } catch (e) {
        result = {}
      }

      let content = result[reply_id || posts_id] || '';

      this.setState({
        content,
        cacheContentList: result
      });

      this.props.navigation.setParams({ submit: this.onSubmit });

    });

  }

  async onSubmit() {
    const result = this.getContent();
    const { addComment, updateComment, navigation } = this.props;
    const { _id, posts_id, parent_id, reply_id } = this.props.navigation.state.params;

    if (this.state.submitting) return;

    if (!result) return;
    if (result.loading) Alert.alert('存在未上传完成的图片，请等待上传完成后再提交');

    let err, res;

    this.state.submitting = true;
    this.props.navigation.setParams({ submitting: true });

    if (_id) {

      [ err, res ] = await updateComment({
        _id,
        content: result.json,
        content_html: result.html
      });

      if (!err) {
        RNToasty.Success({ title: '更新成功' });
        navigation.goBack();
      } else {

        RNToasty.Error({
          title: err.message || '提交失败'
        });
      }

    } else {

      // console.log({
      //   posts_id: posts_id,
      //   parent_id: parent_id || '',
      //   reply_id: reply_id || '',
      //   contentJSON: result.json,
      //   contentHTML: result.html,
      //   deviceId: '7'
      // });

      [ err, res ] = await addComment({
        posts_id: posts_id,
        parent_id: parent_id || '',
        reply_id: reply_id || '',
        contentJSON: result.json,
        contentHTML: result.html,
        deviceId: '7'
      });

      if (!err) {
        RNToasty.Success({ title: '提交成功' });
        navigation.goBack();

        if (this.state.cacheContentList[reply_id || posts_id]) {
          delete this.state.cacheContentList[reply_id || posts_id];
        }

        AsyncStorage.setItem('comments-content', JSON.stringify(this.state.cacheContentList), (errs, result)=>{});

      } else {
        RNToasty.Error({
          title: err.message || '提交失败'
        });
      }

    }

    this.state.submitting = false;
    this.props.navigation.setParams({ submitting: false });

  }

  onChange(content) {
    
    const { _id, posts_id, parent_id, reply_id } = this.props.navigation.state.params;

    if (!_id) {

      if (content) {
        this.state.cacheContentList[reply_id || posts_id] = content;
      } else if (!content && this.state.cacheContentList[reply_id || posts_id]) {
        delete this.state.cacheContentList[reply_id || posts_id];
      }

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
