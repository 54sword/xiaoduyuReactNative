import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableOpacity } from 'react-native';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getProfile } from '../../../../../store/reducers/user';
import styles from './styles';

import navigationService from '../../../../../navigators/service';

@connect(
  (state, props) => {
    return {
      me: getProfile(state)
    }
  },
  dispatch => ({
  })
)
export default class ListItem extends React.Component {

  static propTypes = {
    // 话题的id
    message: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
  }

  render() {

    const { message } = this.props;

    // console.log(message);

    return (<TouchableOpacity
      style={styles.item}
      onPress={()=>{
        navigationService.navigate("sessionsDetail", {
          id: message._id,
          title: message.user_id.nickname
        })
      }}
      >

      <View style={styles.itemLeft}>

        <View>
          <Image source={{uri: 'https:'+message.user_id.avatar_url}} style={styles.avatar} />
          {message.unread_count ?
            <View style={styles.unreadCount}>
              {message.unread_count > 99 ?
                <Text style={styles.unreadCountTextMore}>…</Text>
                :
              <Text style={styles.unreadCountText}>{message.unread_count}</Text>}
            </View>
            : null}
        </View>

        <View>
          <Text style={styles.nickname} numberOfLines={1}>{message.user_id.nickname}</Text>
        </View>
        
        {message.last_message ?
          <View style={styles.lastMessage}>
            <Text style={styles.lastMessageText} numberOfLines={1}>{message.last_message.content_summary}</Text>
          </View>
          : null}
          
      </View>
      
      <View>
        <View>
          <Text style={styles.createAt}>
          {message.last_message ? message.last_message._create_at : message._create_at}
          </Text>
        </View>
      </View>

    </TouchableOpacity>)
  }

}
