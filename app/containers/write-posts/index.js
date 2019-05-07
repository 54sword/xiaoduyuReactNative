import React, { Component } from 'react';
import {
  Text, View, ScrollView, Button, TextInput, Alert, Image,
  TouchableOpacity, PixelRatio, Platform
} from 'react-native';


import AsyncStorage from '@react-native-community/async-storage';

import { Toast } from 'teaset';
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import To from '../../common/to';

// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProfile } from '../../store/reducers/user';
import { addPosts, updatePosts, loadPostsList } from '../../store/actions/posts';

// components
import Editor from '../../components/editor';
import Wait from '../../components/ui/wait';
import Loading from '../../components/ui/loading';

// styles
import styles from './styles';

@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
    addPosts: bindActionCreators(addPosts, dispatch),
    updatePosts: bindActionCreators(updatePosts, dispatch),
    loadPostsList: bindActionCreators(loadPostsList, dispatch)
  })
)
export default class WritePosts extends React.Component {

  /*
  static defaultProps = {
    topic: null,
    posts: null
  }
  */

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    const { topic, showTopic, submit, allowPost = false } = params;
    return {
      // header: null,
      headerStyle: {
        elevation: 0,
        backgroundColor: '#fff',
        borderBottomWidth: 1/PixelRatio.get(),
        borderColor:'#e7e9ec'
      },
      headerTitle: (<TouchableOpacity style={[styles.button,, {justifyContent:'center'}]} onPress={showTopic}>
                      {topic ? <Image source={{uri:'https:'+topic.avatar}} style={{width:20,height:20,borderRadius:10,marginRight:5}} /> : null}
                      <Text style={!topic ? styles.buttonText : {fontWeight:'bold',fontSize:16}}>{topic ? topic.name : '选择一个话题'}</Text>
                   </TouchableOpacity>),
      headerLeft: (<TouchableOpacity style={styles.button} onPress={()=>{ navigation.goBack() }}>
                    <Text style={styles.buttonText}>取消</Text>
                   </TouchableOpacity>),
      headerRight: (<TouchableOpacity style={styles.button} onPress={submit}>
                    <Text style={styles.buttonText}>发布</Text>
                   </TouchableOpacity>)
      // headerStyle: {
      //   backgroundColor: '#fff',
      //   borderBottomWidth: 0
      // }
    }
  }

  constructor (props) {
    super(props);

    const { useCache = true } = this.props.navigation.state.params || {};

    this.state = {
      loading: true,
      title: '',
      // 编辑的时候需要使用
      posts: null,
      topic: null,
      title: null,
      content: null,
      useCache
    }
    this.submit = this.submit.bind(this);
    this.showTopic = this.showTopic.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onChangeContent = this.onChangeContent.bind(this);
  }

  async componentDidMount() {

    const self = this;
    const { loadPostsList, navigation } = this.props;
    const { posts_id, topic } = navigation.state.params || {};
    const { useCache } = this.state;

    this.props.navigation.setParams({
      submit: this.submit,
      showTopic: this.showTopic,
      cancel: () => {
        navigation.goBack();
      }
    });

    // 不是编辑状态
    if (!posts_id) {

      if (!useCache) {
        this.setState({ loading: false, topic });
        this.props.navigation.setParams({ topic });
        return;
      }

      Promise.all([
        new Promise(function(resolve, reject) {
          AsyncStorage.getItem('posts-topic', function(errs, result){
            resolve(result)
          });
        }),
        new Promise(function(resolve, reject) {
          AsyncStorage.getItem('posts-title', function(errs, result){
            resolve(result)
          });
        }),
        new Promise(function(resolve, reject) {
          AsyncStorage.getItem('posts-content', function(errs, result){
            resolve(result)
          });
        })
      ]).then(function(values) {

        // console.log(values);

        let topic = null;

        try {
          topic = JSON.parse(values[0]);

          self.props.navigation.setParams({ topic });

        } catch (e) {

        }

        self.setState({
          loading: false,
          topic,
          title: values[1],
          content: values[2]
        });

      });


      // AsyncStorage.setItem('posts-posts', JSON.stringify(topic), function(errs, result){});
      // AsyncStorage.setItem('posts-title', title, function(errs, result){});
      // AsyncStorage.setItem('posts-content', json, function(errs, result){});

      return
    }

    let [ err, res ] = await loadPostsList({
      id: 'edit_'+posts_id,
      filters: {
        variables: { _id: posts_id },
        select: `
        _id
        comment_count
        content
        content_html
        create_at
        deleted
        device
        follow_count
        ip
        last_comment_at
        like_count
        recommend
        sort_by_date
        title
        topic_id{
          _id
          name
          avatar
        }
        type
        user_id{
          _id
          nickname
          brief
          avatar_url
        }
        verify
        view_count
        weaken
        follow
        like
        `
      }
    });


    if (err) {
      Toast.fail(err.message || '未知错误');
      navigation.goBack();
      return
    }

    this.setState({
      loading: false,
      posts: res.data[0],
      title: res.data[0].title,
      topic: res.data[0].topic_id,
      content: res.data[0].content
    });

    this.props.navigation.setParams({
      topic: res.data[0].topic_id
    });

  }

  async submit() {

    const self = this;
    const { addPosts, updatePosts, navigation } = this.props;
    const { navigate } = navigation;
    // const { topic } = navigation.state.params;
    const { title, posts, topic, useCache } = this.state;

    if (!title) {
      this.refs.title.focus();
      return;
    }

    if (!topic) return this.showTopic();

    const result = this.getContent();

    // console.log(result);

    // return;

    if (!result) return;
    if (result.loading) return Alert.alert('存在未上传完成的图片，请等待上传完成后再提交');

    self.setState({ visible: true });

    if (posts) {

      // 更新
      let [ err, res ] = await To(updatePosts({
        id: posts._id,
        // type: type._id,
        // topicId: posts._id,
        // topicName: posts.name,
        title: title,
        detail: result.json,
        detailHTML: result.html
      }));

      self.setState({ loading: false });

      if (res && res.success) {
        navigation.goBack();
      } else {
        Toast.fail(err.message || '未知错误');
      }

      return
    }

    let [err, res] = await addPosts({
      title: title,
      detail: result.json,
      detailHTML: result.html,
      topicId: topic._id,
      device: Platform.OS == 'ios' ? 7 : 8,
      type: 1
    });

    if (res && res.success) {

      self.setState({ loading: false, visible: false }, ()=>{

        setTimeout(()=>{

          navigation.popToTop();

          setTimeout(()=>{
            navigate('PostsDetail', { title, id: res._id });
          }, 1000);

        }, 1000);

      });

      if (useCache) {

        AsyncStorage.setItem('posts-topic', '', ()=>{});
        AsyncStorage.setItem('posts-title', '', ()=>{});
        AsyncStorage.setItem('posts-content', '', ()=>{});

      }
      
    } else {

      self.setState({ loading: false, visible: false });
      Toast.fail(err.message || '未知错误');

    }

  }

  // 显示话题
  showTopic(topic) {
    this.props.navigation.navigate('ChooseTopic', {
      onChoose: topic => {
        this.setState({ topic });
        this.props.navigation.setParams({ topic });

        const { posts_id } = this.props.navigation.state.params || {};
        const { useCache } = this.state;

        if (!posts_id && useCache) {
          AsyncStorage.setItem('posts-topic', JSON.stringify(topic), function(errs, result){});
        }

      }
    });
  }

  onChangeText(title) {

    this.state.title = title;

    const { posts_id } = this.props.navigation.state.params || {};
    const { useCache } = this.state;

    if (!posts_id && useCache) {
      AsyncStorage.setItem('posts-title', title, function(errs, result){});
    }

  }

  onChangeContent(json = '') {

    console.log(json)

    const { posts_id } = this.props.navigation.state.params || {};
    const { useCache } = this.state;

    if (!posts_id && useCache) {
      AsyncStorage.setItem('posts-content', json, function(errs, result){});
    }
  }

  render() {

    const self = this
    const { loading, title, content, topic } = this.state;
    const { navigation } = this.props;

    if (loading) return <Loading />;

    let EditorStyles = {
      flex:1
    }

    if (global.OS == 'ios') {
      EditorStyles = {
        minHeight: global.screen.height - 45 - (isIphoneX() ? 86 : 64)
      }
    }

    return (<View style={{flex:1}}>

      <View>
        <TextInput
          ref="title"
          style={styles.title}
          onChangeText={this.onChangeText}
          placeholder='请输入标题'
          defaultValue={title}
          autoFocus={true}
          underlineColorAndroid='transparent'
          />
      </View>

      <View style={EditorStyles}>

        <Editor
          focus={false}
          getContent={callback=>{
            this.getContent = callback;
          }}
          onChange={this.onChangeContent}
          placeholder="请输入正文"
          darftJSON={content}
          type="posts"
        />


      </View>

      {this.state.visible ? <Wait /> : null}


    </View>)
  }
}
