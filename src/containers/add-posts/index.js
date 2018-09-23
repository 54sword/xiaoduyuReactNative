import React, { Component } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { getPostsTips } from '../../reducers/website';
// import { getProfile } from '../../reducers/user';
// import { loadNewPosts } from '../../actions/posts';

@connect(
  (state, props) => ({
    // me: getProfile(state),
    // postsTips: getPostsTips(state)
  }),
  dispatch => ({
    // loadNewPosts: bindActionCreators(loadNewPosts, dispatch)
  })
)
export default class AddPosts extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: '',
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={require('./images/plus.png')}
          style={{ width:130*0.3, height:106*0.3, marginTop: global.OS == 'android' ? 8 : 19 }}
          />
      ),
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        if (global.signInStatus) {
          navigation.navigate('WritePosts');
        } else {
          navigation.navigate('Sign', { routeName: 'WritePosts' });
        }
      }
    }
  }

  render() {
    return null
  }
}
