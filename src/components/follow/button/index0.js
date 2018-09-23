
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { follow, unfollow } from '../../actions/follow'
import { getProfile } from '../../reducers/user'

const S = global.styles

class FollowButton extends Component {

  constructor (props) {
    super(props)
  }

  follow() {
    const { topic_id, posts_id, people_id, follow, handleFollow, handleUnfollow } = this.props
    let fn = follow ? handleUnfollow : handleFollow

    let data = {}

    if (posts_id) {
      data.posts_id = posts_id
    } else if (people_id) {
      data.people_id = people_id
    } else if (topic_id) {
      data.topic_id = topic_id
    }

    fn({
      data,
      callback: (res)=> {
        if (res && !res.success) {
          Alert.alert('', res.error : '提交失败')
        }
      }
    })
  }

  render() {
    const { follow = false, follow_count, people_id, me } = this.props

    // 如果是关注用户，如果是自己的话，则没有关注按钮
    if (me && people_id && me._id == people_id) return (<View></View>)

    return (<TouchableOpacity onPress={this.follow.bind(this)} style={follow ? styles.itema : styles.item}>
              <Image source={require('../comment-item/images/follow.png')} style={[{width:14,height:14}]} resizeMode="cover" />
              {/*<Text style={S['f-s-10']}>{follow ? '已关注' : '关注'}{posts_id ? '帖子' : null}{follow_count || null}</Text>*/}
              <Text style={[S['f-s-12'], S['m-l-5'], { color: '#5f5f5f' }]}>{follow ? '已关注' : '关注'}</Text>
          </TouchableOpacity>)
  }
}


const styles = StyleSheet.create({
  item: {
    // flex:1,
    paddingTop:5,
    paddingBottom:5,
    paddingLeft:5,
    paddingRight:5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:'#efefef',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#5f5f5f'
  },
  itema: {
    // flex:1,
    paddingTop:5,
    paddingBottom:5,
    paddingLeft:5,
    paddingRight:5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#efefef',
    borderRadius: 4
  }
})

export default connect((state, props) => {
    return {
      me: getProfile(state)
    }
  },
  (dispatch) => ({
    handleFollow: bindActionCreators(follow, dispatch),
    handleUnfollow: bindActionCreators(unfollow, dispatch)
  })
)(FollowButton)
