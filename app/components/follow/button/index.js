import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, Image, TouchableOpacity, PixelRatio } from 'react-native';
import { Toast } from 'teaset';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { follow, unfollow } from '../../../store/actions/follow';
import { getProfile } from '../../../store/reducers/user';

@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
    follow: bindActionCreators(follow, dispatch),
    unfollow: bindActionCreators(unfollow, dispatch)
  })
)
export default class FollowButton extends Component {

  static propTypes = {
    posts: PropTypes.object,
    user: PropTypes.object,
    topic: PropTypes.object
  }

  static defaultProps = {
    // follow 或 unfollow 执行完成后回调
    onFinish: ()=>{},
    buttonType: 'text'
    // generalView: <Text>关注</Text>,
    // activeView: <Text>已关注</Text>
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      buttonList: {
        'text': {
          general: (count)=><Text>{count} 关注</Text>,
          active: (count)=><Text>{count} 已关注</Text>
        },
        'max-white': {
          general: (count)=>{
            return (<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
              <Image source={require('./images/follow.png')} style={{width:25,height:25}} />
              {count ? <Text style={{fontSize:17, color:'#fff', marginLeft:5}}>{count}</Text> : null}
            </View>)
          },
          active: (count)=>{
            return (<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
              <Image source={require('./images/follow-active.png')} style={{width:25,height:25}} />
              {count ? <Text style={{fontSize:17, color:'#fff', marginLeft:5}}>{count}</Text> : null}
            </View>)
          },
        },
        'max-gary': {
          general: (count)=>{
            return (<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
              <Image source={require('./images/follow.png')} style={{width:20,height:20}} />
              {count ? <Text style={{fontSize:17, color:'#333', marginLeft:5}}>{count}</Text> : null}
            </View>)
          },
          active: (count)=>{
            return (<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
              <Image source={require('./images/follow-active.png')} style={{width:20,height:20}} />
              {count ? <Text style={{fontSize:17, color:'#333', marginLeft:5}}>{count}</Text> : null}
            </View>)
          },
        }
      }
    }
    this.submit = this.submit.bind(this);
  }

  async submit() {

    if (this.state.loading) return;

    const { unfollow, follow, posts, user, topic, onFinish } = this.props
    let target = posts || user || topic;

    let args = {};
    if (posts) args.posts_id = posts._id;
    if (user) args.user_id = user._id;
    if (topic) args.topic_id = topic._id;

    this.state.loading = true;

    let err, res;

    if (target.follow) {
      [ err, res ] = await unfollow({ args });
    } else {
      [ err, res ] = await follow({ args });
    }

    if (err) {
      Toast.fail(err.message || '提交失败');
    } else {

      if (posts) {
        Toast.success(target.follow ? '收藏成功' : '取消收藏');
      } else {
        Toast.success('提交成功');
      }

      
    }

    this.state.loading = false;

    onFinish();
  }

  render() {

    const { me, posts, user, topic, generalView, activeView, buttonType } = this.props;
    let target = posts || user || topic;
    const { buttonList } = this.state;

    // 自己的问题，不能关注

    let button = buttonList[buttonType];

    // if (!me) return null;

    // 自己的问题，不能关注
    if (
      !me ||
      me && posts && posts.user_id && posts.user_id._id == me._id ||
      me && user && user._id == me._id
    ) {
      return null;
    }

    if (buttonType == 'collect') {

      return (<TouchableOpacity
        onPress={this.submit}
        style={{paddingLeft:15, paddingRight:15, height:45, justifyContent:'center', alignItems:'center' }}
        >
        {target.follow ?
          <Image source={require('./images/follow-active.png')} style={{width:18,height:18}} />
        :
          <Image source={require('./images/follow.png')} style={{width:18,height:18}} />
        }
      </TouchableOpacity>)

    }

    return (<TouchableOpacity
      onPress={this.submit}
      style={{backgroundColor:target.follow ? '#efefef' : '#f0f0f6', paddingLeft:12, paddingRight:12, borderRadius:12, height:25, justifyContent:'center' }}>
      {target.follow ?
        <Text style={{fontWeight:'bold',color:'#a3a6ad',fontSize:13}}>已关注</Text>
      :
        <Text style={{fontWeight:'bold',color:'#436ce6',fontSize:13}}>关注</Text>
      }
    </TouchableOpacity>)
  }
}
