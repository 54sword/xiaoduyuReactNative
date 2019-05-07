import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
// import { ifIphoneX } from 'react-native-iphone-x-helper';

import { Toast } from 'teaset';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadReportTypes } from '../../store/actions/report';
import { addBlock } from '../../store/actions/block';
import { getProfile, isMember } from '../../store/reducers/user';
import { like, unlike } from '../../store/actions/like';

import navigationService from '../../navigators/service';

// components
// import MenuIcon from '../ui/icon/menu';
// import CommentEditModal from '../comment-edit-modal';

@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
    loadReportTypes: bindActionCreators(loadReportTypes, dispatch),
    addBlock: bindActionCreators(addBlock, dispatch),
    like: bindActionCreators(like, dispatch),
    unlike: bindActionCreators(unlike, dispatch)
  })
)
export default class ReportMenu extends Component {

  static propTypes = {
    // 帖子
    posts: PropTypes.object,
    // 用户
    people: PropTypes.object,
    // 评论
    comment: PropTypes.object
  }

  static defaultProps = {
    buttonType: 'gary',
    buttonStyle: {}
    // icon: <Image source={require('./images/more.png')} style={{width:20,height:20}} />
  }

  constructor(props) {
    super(props);

    this.state = {
      options: [],
      buttonList: {
        'gary': <Image source={require('./images/more-black.png')} style={{width:16,height:16, tintColor:'#7f7f7f'}} />,
        'white': <Image source={require('./images/more-white.png')} style={{width:25,height:25}} />,
        'black': <Image source={require('./images/more-black.png')} style={{width:18,height:18}} />,
      }
    }

    this.chooseSheet = this.chooseSheet.bind(this);
    this.report = this.report.bind(this);
    this.block = this.block.bind(this);
    this.handleLike = this.handleLike.bind(this);

    this.showActionSheet = this.showActionSheet.bind(this);
  }

  componentDidMount() {

    const { me, posts, comment, people } = this.props;

    let options = ['取消'];

    if (comment) options.push('回复');
    if (posts) options.push('评论');

    if (posts && me && me._id != posts.user_id._id) {
      if (posts.like) {
        options.push('取消赞同');
      } else {
        options.push('赞同');
      }
    }

    if (comment && me && me._id != comment.user_id._id) {
      if (comment.like) {
        options.push('取消赞同');
      } else {
        options.push('赞同');
      }
    }

    if (posts && me && me._id == posts.user_id._id ||
      comment && me && me._id == comment.user_id._id
    ) {
      options.push('编辑');
    }

    if (posts && me && me._id != posts.user_id._id ||
      people && me && me._id != people._id
    ) {
      options.push('不感兴趣');
    }

    if (posts && me && me._id != posts.user_id._id ||
      comment && me && me._id != comment.user_id._id ||
      people && me && me._id != people._id
    ) {
        options.push('举报');
    }

    

    this.setState({
      options
    });

  }

  async block(e) {

    const { posts, people, comment, addBlock } = this.props;

    let args = {};

    if (posts) {
      args.posts_id = posts._id;
    } else if (people) {
      args.people_id = people._id;
    } else if (comment) {
      args.comment_id = comment._id;
    } else {
      Toast.fail('缺少资源');
      // RNToasty.Error({
      //   title: '缺少资源'
      // });
      return
    }

    let [ err, res ] = await addBlock({ args });

    if (res && res.success) {

      navigationService.goBack();

      Toast.success('屏蔽成功');

      // RNToasty.Success({
      //   title: '屏蔽成功'
      // });

    } else if (err && err.message) {
      Toast.fail(err.message || '提交失败');
      // RNToasty.Warn({
      //   title: err.message
      // });
    }

  }

  report(e) {
    const { navigate } = this.props.navigation;
    navigate('Report', this.props);
  }

  showActionSheet() {
    this.ActionSheet.show();
  }

  chooseSheet(k) {

    const { options } = this.state;
    const { posts, comment } = this.props;
    const { navigate } = this.props.navigation;

    switch (options[k]) {
      case '不感兴趣':
        this.block();
        break;
      case '举报':
        this.report();
        break;
      case '编辑':

        // 延迟触发，让menu先收起来，否则android focus 编辑器无效
        setTimeout(()=>{

          if (posts) {
            navigate('WritePosts', { posts_id: posts._id, topic: posts.topic_id });
          } else if (comment) {
            navigate('WriteComment', { _id: comment._id });
            // this.setCommentEditModalVisble();
          }

        }, 500);

        // this.report();
        break;
      case '回复':

        // 延迟触发，让menu先收起来，否则android focus 编辑器无效
        setTimeout(()=>{

          navigate('WriteComment', {
            posts_id: typeof comment.posts_id == 'string' ? comment.posts_id : comment.posts_id._id,
            parent_id: comment.parent_id || comment._id,
            reply_id: comment._id
          });

        }, 500);

        break;

      case '回帖':

        // 延迟触发，让menu先收起来，否则android focus 编辑器无效
        setTimeout(()=>{
          navigate('WriteComment', {
            posts_id: posts._id
          });
        }, 500);
        break;

      case '赞同':
        this.handleLike();
        break;

      case '取消赞同':
        this.handleLike();
        break;
    }

  }

  async handleLike() {

    if (this.state.loading) return;

    const { like, unlike, comment, posts } = this.props;
    const target = comment || posts;
    const status = target.like,
          targetId = target._id;
    let type = '';

    // 赞帖子
    if (posts) type = 'posts';
    // 赞回帖
    if (comment && comment.parent_id) type = 'comment';
    // 赞回复
    if (comment && !comment.parent_id) type = 'reply';

    this.state.loading = true;

    let err, res;

    if (status) {

      [ err, res ] = await unlike({
        type: type,
        target_id: targetId
      });

    } else {

      [ err, res ] = await like({
        type: type,
        target_id: targetId,
        mood: 1
      });

    }

    if (res && res.success) {
      // RNToasty.Success({
      //   title: status ? '已取消赞同' : '提交成功'
      // });

    } else {
      // RNToasty.Warn({
      //   title:  err || '提交失败'
      // });
    }

    this.state.loading = false;

    // 操作完成后，更细选项视图
    this.componentDidMount();
  }

  render () {

    const self = this;
    const { options, buttonList } = this.state;
    const { me, comment, navigation, buttonType, buttonStyle } = this.props;

    if (!me) return <View></View>;
    
    let icon = buttonList[buttonType];

    return <View>

      <TouchableOpacity onPress={this.showActionSheet} style={buttonStyle}>
        {icon}
      </TouchableOpacity>

      <ActionSheet
        ref={o => this.ActionSheet = o}
        options={options}
        cancelButtonIndex={0}
        destructiveButtonIndex={0}
        onPress={this.chooseSheet}
        // styles={{
        //   ...ifIphoneX({
        //     cancelButtonBox: { paddingBottom:20, height:65 }
        //   }, {})
        // }}
      />

      {/*me && comment && me._id == comment.user_id._id ?
        <CommentEditModal navigation={navigation} _id={comment._id} setVisible={(callback)=>{
          self.setCommentEditModalVisble = callback;
        }} />
        : null*/}

    </View>
  }
}
