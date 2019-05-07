import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, Image, TouchableOpacity, Platform, Linking } from 'react-native';
// import Platform from 'Platform';
// import { StackActions, NavigationActions } from 'react-navigation';
// import JPushModule from 'jpush-react-native'
// import * as JPush from '../../common/jpush';

import config from '../../../config';

// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProfile } from '../../store/reducers/user';
// import { signOut } from '../../actions/sign'
import { removeAccessToken } from '../../store/actions/user';
import { getClientInstalled } from '../../store/reducers/client-installed';
// import { cleanAllData } from '../../store/actions/sign';

// components
import { ListItem } from '../../components/ui';
// import websocket from '../../common/websocket';

// styles
import styles from './style';

@connect(
  (state, props) => ({
    me: getProfile(state),
    clientInstalled: getClientInstalled(state)
  }),
  dispatch => ({
    removeAccessToken: bindActionCreators(removeAccessToken, dispatch),
    // cleanAllData: bindActionCreators(cleanAllData, dispatch)
  })
)
export default class Settings extends React.Component {

  static navigationOptions = {
    title: '设置'
  }

  constructor (props) {
    super(props)
    this.state = {
      qq: false,
      weibo: false
    }
    this.signOut = this.signOut.bind(this)
  }

  signOut() {

    const self = this
    const { navigation, removeAccessToken } = this.props

    Alert.alert('', '您确认退出吗？', [
      {text:'取消',onPress:()=>{}},
      {text:'确定',onPress: async ()=>{

        // console.log();
        // cleanAllData();

        await global.signOut();

        // JPush.empty();

        /*
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Entrance' })]
        });

        self.props.navigation.dispatch(resetAction);
        */

        /*
        removeAccessToken()

        AsyncStorage.removeItem('binding-phone-tips', function(res){})

        AsyncStorage.removeItem('token', function(res){


          // 设置别名
          AsyncStorage.removeItem('jpush_alias', function(){
            JPushModule.setAlias('invalid', ()=>{})
          })

          // 清除tag
          AsyncStorage.removeItem('jpush_tag', function(){
            JPushModule.setTags(['invalid'], ()=>{})
          })

          // if (Platform.OS === 'android') {
            // JPushModule.initPush();
            // JPushModule.stopPush()
          // }

          websocket.stop();

          global.cleanRedux()

          global.signIn = false


            const resetAction = NavigationActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({ routeName: 'Welcome'})
              ]
            })

            self.props.navigation.dispatch(resetAction)



        })
        */

      }}
    ])

  }

  render() {

    const { me, clientInstalled } = this.props;
    const { navigate } = this.props.navigation;
    

    return (<ScrollView style={styles.container}>
          <View style={styles.main}>

            <TouchableOpacity onPress={()=>{ navigate('AccountAndSecurity', {}) }}>
              <ListItem name={<Text>账号与安全</Text>} />
            </TouchableOpacity>

            <View style={styles.gap}></View>

            <TouchableOpacity onPress={()=>{ navigate('Block') }}>
              <ListItem name={"屏蔽"} />
            </TouchableOpacity>

            <View style={styles.gap}></View>

            <TouchableOpacity onPress={()=>{
              Linking.openURL('itms-apps://itunes.apple.com/cn/app/id1261181004?mt=8&action=write-review')
              // Linking.openURL('https://itunes.apple.com/cn/app/小度鱼/id1261181004?mt=8&action=write-review')
            }}>
              <ListItem name={<Text>在 App Store 评价小度鱼</Text>} />
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{ navigate('Agreement', {}) }}>
              <ListItem name={<Text>用户协议</Text>} />
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{
              Linking.openURL(`mailto:${config.feedbackEmail}`)
            }}>
              <ListItem name={<Text>建议与反馈</Text>} />
            </TouchableOpacity>

            {/* <TouchableOpacity onPress={()=>{this.signOut()}}>
              <ListItem name={<Text>关于小度鱼</Text>} />
            </TouchableOpacity> */}
{/* 
            <TouchableOpacity onPress={()=>{this.signOut()}}>
              <ListItem name={<Text>分享给朋友</Text>} />
            </TouchableOpacity> */}

            <View style={styles.gap}></View>

            <TouchableOpacity onPress={()=>{this.signOut()}}>
              <ListItem name={<Text style={{color:'rgb(230, 61, 61)'}}>退出登录</Text>} />
            </TouchableOpacity>
            
            <View style={{height:30}}></View>

          </View>
      </ScrollView>)
  }
}
