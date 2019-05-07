import React, { Component } from 'react'
import { Text, View, Image, ScrollView } from 'react-native'

import { SafeAreaView } from 'react-navigation';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getProfile } from '../../store/reducers/user'

import Header from '../../components/header'
import SessionList from '../../components/session/list'

import styles from './style'

@connect(
  (state, props) => ({
    me: getProfile(state),
  }),
  dispatch => ({
  })
)
export default class Me extends React.Component {

  static navigationOptions = ({ navigation }) => {

    const { params = {} } = navigation.state
    const { redPoint = 0 } = params;

    return {
      title: '私信',
      // tabBarIcon: ({ tintColor }) => (<Image source={require('./images/me.png')} style={[styles.icon, {tintColor: tintColor}]} />),
      tabBarIcon: ({ tintColor, focused }) => (
        <View>
          <View style={styles.tabBarIcon}>
            <Image
              source={focused ? require('./images/message-active.png') : require('./images/message.png')}
              style={[styles.icon, {tintColor: tintColor}]}
              />
          </View>
          {redPoint > 0 ?
            <View style={styles.subscript}>
              {redPoint > 99 ? 
              <Text style={styles.subscriptTextMore}>…</Text> : 
              <Text style={styles.subscriptText}>{redPoint}</Text>}
            </View> : null}
      </View>),
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        if (global.signInStatus) {
          defaultHandler();
        } else {
          navigation.navigate('Sign', { routeName: 'sessions' });
        }
      }
    }
  }

  constructor (props) {
    super(props)
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>

      <Header
        left={<Text></Text>}
        center={
          <View style={{ height:40, justifyContent:'center',alignItems:'center'}}>
            <Text style={{fontSize: 16, fontWeight:'bold'}}>私信</Text>
          </View>
        }
        right={<Text></Text>}
        />

      <View style={{flex:1}}>
        <SessionList
          id="all"
          filters={{
            query: {
              sort_by:'last_message:-1'
            }
          }}
          />
      </View>
      
    </SafeAreaView>)
  }

}