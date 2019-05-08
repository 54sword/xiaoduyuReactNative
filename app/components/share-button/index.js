import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import * as WeChat from 'react-native-wechat';
import * as QQAPI from 'react-native-qq';
import { Toast } from 'teaset';


// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getClientInstalled } from '../../store/reducers/client-installed';
// import { isMember } from '../../reducers/user';
// import { like, unlike } from '../../actions/like';

@connect(
  (state, props) => ({
    installed: getClientInstalled(state)
  }),
  dispatch => ({
  })
)
export default class LikeButton extends Component {

  static propTypes = {
    // 帖子
    posts: PropTypes.object,
    // 评论
    comment: PropTypes.object,
    // 回复
    reply: PropTypes.object
  }

  static defaultProps = {
    buttonStyle: {}
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    }
    // this.handleShare = this.handleShare.bind(this);
    this.showActionSheet = this.showActionSheet.bind(this);
    this.chooseSheet = this.chooseSheet.bind(this);
  }

  showActionSheet() {
    this.ActionSheet.show();
  }

  async chooseSheet(k) {
    
    const { posts, comment, installed } = this.props;

    if (k == 1) {

      if (!installed['weixin']) {
        Toast.message('未安装微信');
        return;
      }

      try {

        // 分享给好友
        await WeChat.shareToSession({
          title: posts.title,
          description: posts.content_summary,
          thumbImage: posts.images.length > 0 ? 'https:'+posts.images : 'https://img.xiaoduyu.com/xiaoduyu-icon-512.png',
          type:'news',
          webpageUrl:'https://www.xiaoduyu.com/posts/'+posts._id
        })
        .catch((error) => {
          console.log(error);
        });
      } catch (e) {
        if (e instanceof WeChat.WechatError) {
          console.error(e.stack);
        } else {
          throw e;
        }
      }

      return;
    } else if (k == 2) {

      if (!installed['weixin']) {
        Toast.message('未安装微信');
        return;
      }

      try {
        // 分享朋友圈
        await WeChat.shareToTimeline({
          type: 'news',
          title: posts.title,
          webpageUrl:'https://www.xiaoduyu.com/posts/'+posts._id,
          thumbImage: posts.images.length > 0 ? 'https:'+posts.images : 'https://img.xiaoduyu.com/xiaoduyu-icon-512.png'
        })
        .catch((error) => {
          console.log(error);
        });
      } catch (e) {
        if (e instanceof WeChat.WechatError) {
          console.error(e.stack);
        } else {
          throw e;
        }
      }

    } else if (k == 3) {
      
      if (!installed['qq']) {
        Toast.message('未安装QQ');
        return;
      }

      QQAPI.shareToQQ({
        type: 'news',
      	title: posts.title,
      	description: posts.content_summary,
      	webpageUrl: 'https://www.xiaoduyu.com/posts/'+posts._id,
      	imageUrl: posts.images.length > 0 ? 'https:'+posts.images : 'https://img.xiaoduyu.com/xiaoduyu-icon-512.png'
      });
      
    } else if (k == 4) {
      
      if (!installed['qq']) {
        Toast.message('未安装QQ');
        return;
      }

      QQAPI.shareToQzone({
        type: 'news',
      	title: posts.title,
      	description: posts.content_summary,
      	webpageUrl: 'https://www.xiaoduyu.com/posts/'+posts._id,
      	imageUrl: posts.images.length > 0 ? 'https:'+posts.images : 'https://img.xiaoduyu.com/xiaoduyu-icon-512.png'
      });
    
    }
    

  }

  render () {

    return (<View>

      <TouchableOpacity onPress={this.showActionSheet} style={this.props.buttonStyle}>
        <Image source={require('./images/share.png')} style={{width:18,height:18}} />
      </TouchableOpacity>

      <ActionSheet
        ref={o => this.ActionSheet = o}
        options={['取消','分享给微信好友或群','分享到微信朋友圈', '分享给QQ好友或群', '分享到Qzone']}
        cancelButtonIndex={0}
        destructiveButtonIndex={0}
        onPress={this.chooseSheet}
      />

    </View>)
  }
}
