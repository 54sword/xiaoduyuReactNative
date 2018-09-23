
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import { ReactNativeModal } from "react-native-modal";
import { RNToasty } from 'react-native-toasty';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getProfile } from '../../reducers/user';
import { addComment, updateComment, loadCommentList } from '../../actions/comment';

// components
import Editor from '../editor';

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
export default class CommentEditModal extends Component {

  static defaultProps = {
    // 如果存在id表示是更新
    _id: '',
    posts_id: '',
    parent_id: '',
    reply_id: '',
    setVisible: () => {}
  }
  
  constructor (props) {
    super(props)
    this.state = {
      visible: false,
      initialContentJSON: ''
    }
    this.setModalVisible = this.setModalVisible.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    this.props.setVisible(this.setModalVisible);
  }

  // 设置modal显示状态
  async setModalVisible () {

    const { me, _id, navigation, loadCommentList } = this.props;

    if (!me) {
      navigation.navigate('Sign');
      return;
    }

    let initialContentJSON = ''

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

      if (res && res.data && res.data[0]) {
        initialContentJSON = res.data[0].content;
      }

    }

    this.setState({
      visible: this.state.visible ? false : true,
      initialContentJSON
    });

  }

  async onSubmit() {
    const result = this.getContent();
    const {
      addComment, updateComment,
      _id, posts_id, parent_id, reply_id
    } = this.props;

    if (!result) return;

    if (result.loading) Alert.alert('存在未上传完成的图片，请等待上传完成后再提交');

    let err, res;

    if (_id) {

      [ err, res ] = await updateComment({
        _id,
        content: result.json,
        content_html: result.html
      });

      if (!err) {
        RNToasty.Success({ title: '更新成功' });
        this.setState({ visible: false });
      } else {

        Alert.alert('更新失败', err.message || '');

        // RNToasty.Error({
        //   title: err.message || '提交失败'
        // });
      }

    } else {

      [ err, res ] = await addComment({
        posts_id: posts_id,
        parent_id: parent_id,
        reply_id: reply_id,
        contentJSON: result.json,
        contentHTML: result.html,
        deviceId: '7'
      });

      if (!err) {
        RNToasty.Success({ title: '提交成功' });
        this.setState({ visible: false });
      } else {

        Alert.alert('提交失败', err.message || '');

        // RNToasty.Error({
        //   title: err.message || '提交失败'
        // });
      }

    }

  }

  render() {

    const self = this;
    const { visible, initialContentJSON } = this.state;

    return (<View>

      <TouchableOpacity onPress={this.setModalVisible} style={{marginRight:5}}>
        {this.props.children}
      </TouchableOpacity>

      <ReactNativeModal
        // animationType="slide"
        // transparent={true}
        isVisible={visible}
        style={{
          padding:0,
          margin:0
        }}
        // onBackdropPress={this.setModalVisible}
        // supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
        // onRequestClose={()=>{
        //   console.log('1231');
        // }}
        >

        <View style={styles.editorView}>

          <View style={styles.header}>

            <Button
              onPress={this.setModalVisible}
              title="取消"
              color="#484848"
              />

            <Button
              onPress={this.onSubmit}
              title="提交"
              color="#484848"
              />

          </View>

          <View style={{minHeight:global.screen.height - 64}}>
            <Editor
              getContent={callback=>{
                self.getContent = callback;
              }}
              darftJSON={initialContentJSON}
              />
          </View>

        </View>

      </ReactNativeModal>

    </View>)
  }

}
