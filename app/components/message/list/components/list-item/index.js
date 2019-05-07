import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

// components
import HTMLView from '../../../../html-view';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getProfile } from '../../../../../store/reducers/user';

// style
import styles from './styles';

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
    super(props);
    this.state = {}
  }

  render() {

    const { me, message } = this.props;

    let item = null;

    // 自己发送的消息

    if (me._id == message.user_id._id) {
      
      item = (<View style={styles.right}>
        <View style={{flexDirection:'row'}}>
          <View style={[styles.content_html, { borderTopRightRadius:4, backgroundColor:'#bdd5ff' }]}>
            <HTMLView html={message.content_html} imgOffset={120} />
          </View>
          <View>
            <Image source={{ uri: 'https:'+message.user_id.avatar_url }} style={styles.rightAvatar} />
          </View>
        </View>
      </View>)
      
    } else {

      item = (<View style={styles.left}>
        <View style={{flexDirection:'row'}}>
          <View>
            <Image source={{ uri: 'https:'+message.user_id.avatar_url }} style={styles.leftAvatar} />
          </View>
          <View style={[styles.content_html, { borderTopLeftRadius:5 }]}>
            <HTMLView html={message.content_html} />
          </View>
        </View>
      </View>)

    }

    return (<View>
      {message._create_at ?
        <View style={styles.createAt}>
          <Text style={styles.createAtText}>{message._create_at}</Text>
        </View>
        : null}
      {item}
    </View>)


  }

}
