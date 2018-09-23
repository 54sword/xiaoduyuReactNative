import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { RNToasty } from 'react-native-toasty';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isMember } from '../../reducers/user';
import { like, unlike } from '../../actions/like';


@connect(
  (state, props) => ({
    isMember: isMember(state)
  }),
  dispatch => ({
    like: bindActionCreators(like, dispatch),
    unlike: bindActionCreators(unlike, dispatch)
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
    // 执行like或unlike完成后，回调事件
    onFinish: () => {},
    buttonType: 'text',
    generalView: <Text>赞</Text>,
    activeView: <Text>已赞</Text>,
    iconStyle: {
      width:18,height:18
    },
    activeIconStyle: {
      width:18,height:18
    },
    buttonStyle: {}
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      // 按钮类型
      buttonList: {
        'text': {
          general:()=><Text>赞</Text>,
          active: ()=><Text>已赞</Text>
        },
        'min-gray': {
          general:(count)=>{
            return(<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
              <Image source={require('./images/like.png')} style={{width:17,height:17,marginRight:4}} />
              <Text style={{fontSize:13, color:'#66686e'}}>{count || '赞'}</Text>
            </View>)
          },
          active: (count)=>{
            return(<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
              <Image source={require('./images/white-active.png')} style={{width:17,height:17,marginRight:4}} />
              {count ? <Text style={{fontSize:13, color:'#66686e'}}>{count}</Text> : null}
            </View>)
          }
        },
        'max-white': {
          general:(count)=>{
            return(<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
              <Image source={require('./images/white.png')} style={{width:25,height:25}} />
              {count ? <Text style={{fontSize:17, color:'#fff', marginLeft:5}}>{count}</Text> : null}
            </View>)
          },
          active: (count)=>{
            return(<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
              <Image source={require('./images/white-active.png')} style={{width:25,height:25}} />
              {count ? <Text style={{fontSize:17, color:'#fff', marginLeft:5}}>{count}</Text> : null}
            </View>)
          }
        },
        'max-black': {
          general:(count)=>{
            return(<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
              <Image source={require('./images/like.png')} style={{width:20,height:20}} />
              {count ? <Text style={{fontSize:17, color:'#333', marginLeft:5}}>{count}</Text> : null}
            </View>)
          },
          active: (count)=>{
            return(<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
              <Image source={require('./images/like-active.png')} style={{width:20,height:20}} />
              {count ? <Text style={{fontSize:17, color:'#333', marginLeft:5}}>{count}</Text> : null}
            </View>)
          }
        }
      }
    }
    this.handleLike = this.handleLike.bind(this)
  }

  async handleLike() {

    if (this.state.loading) return;

    const self = this;
    const { like, unlike, comment, reply, posts, onFinish } = this.props;
    const target = comment || reply || posts;
    const status = target.like,
          count = target.like_count,
          targetId = target._id;
    let type = '';

    if (comment) type = 'comment';
    else if (reply) type = 'reply';
    else type = 'posts';

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

    if (err) {
      RNToasty.Warn({
        title:  err || '提交失败'
      });
    }


    this.state.loading = false;
    onFinish();
  }

  render () {

    const { reply, comment, posts, isMember, activeView, generalView,
      iconStyle, activeIconStyle, buttonType
    } = this.props;

    const like = comment || reply || posts;

    if (!isMember) {
      return null
      // return (<a href="javascript:void(0)" data-toggle="modal" data-target="#sign" onClick={this.stopPropagation}>赞</a>)
    }

    // const { buttonList } = this.state;

    // const button = buttonList[buttonType];

    return (<TouchableOpacity onPress={(e)=>{this.handleLike(e)}}>

        {like.like ?
          (<View style={[{flexDirection:'row'}, this.props.buttonStyle]}>
            <Image source={require('./images/like-active.png')} style={activeIconStyle} />
            {like.like_count ? <Text style={{fontSize:14, color:'#436ce6', marginLeft:5}}>{like.like_count}</Text> : null}
          </View>)
          :
          (<View style={[{flexDirection:'row'}, this.props.buttonStyle]}>
            <Image source={require('./images/like.png')} style={iconStyle} />
            {like.like_count ? <Text style={{fontSize:14, color:'#4a4a4a', marginLeft:5}}>{like.like_count}</Text> : null}
          </View>)
          }

    </TouchableOpacity>)
  }
}
