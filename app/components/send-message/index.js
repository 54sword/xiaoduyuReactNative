import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import navigationService from '../../navigators/service';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { follow, unfollow } from '@actions/follow';
import { getProfile } from '../../store/reducers/user';
import { getSession } from '../../store/actions/session';

// style
// import './style.scss';

@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
    getSession: bindActionCreators(getSession, dispatch)
  })
)
export default class SendMessage extends Component {

  static propTypes = {
    people_id: PropTypes.string.isRequired
  }

  static defaultProps = {
    className: ''
  }

  constructor(props) {
    super(props)
    this.handle = this.handle.bind(this)
  }

  stopPropagation(e) {
    e.stopPropagation();
  }

  async handle() {
    // e.stopPropagation();
    const { getSession, people_id, nickname } = this.props

    let res = await getSession({ people_id });

    navigationService.navigate("sessionsDetail", {
      id: res,
      title: nickname
    })

    // if (res) {
    //   this.props.history.push(`/session/${res}`)
    // }

  }

  render() {

    const { me, people_id, className } = this.props;

    // 自己的问题，不能关注
    if (me && me._id && me._id == people_id) {
      return null;
    }

    let text = '私信';
    
    if (!me) null;

      return (<TouchableOpacity onPress={this.handle} style={{ paddingLeft:12, paddingRight:12, borderRadius:12, height:25, justifyContent:'center', alignItems:'center', backgroundColor:'#f0f0f6' }}>
        <Text style={{fontWeight:'bold',color:'#436ce6',fontSize:13}}>{text}</Text>
      </TouchableOpacity>)

  }
}
