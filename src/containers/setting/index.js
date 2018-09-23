import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, Image, TouchableOpacity, AsyncStorage, Platform } from 'react-native';
// import Platform from 'Platform';
import { StackActions, NavigationActions } from 'react-navigation';
// import JPushModule from 'jpush-react-native'
import * as JPush from '../../common/jpush';

// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProfile } from '../../reducers/user';
// import { signOut } from '../../actions/sign'
import { removeAccessToken } from '../../actions/user';
import { getClientInstalled } from '../../reducers/client-installed';
import { cleanAllData } from '../../actions/sign';

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
    cleanAllData: bindActionCreators(cleanAllData, dispatch)
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
    const { navigation, removeAccessToken, cleanAllData } = this.props

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

    if (!me || !me._id) return (<View></View>);

    return (<ScrollView style={styles.container}>
          <View style={styles.main}>

            <TouchableOpacity onPress={()=>{ navigate('ResetAvatar', {}) }}>
              <ListItem
                name={"头像"}
                rightElement={<Image source={{uri:'https:'+me.avatar_url}} style={{width:50,height:50,margin:10,borderRadius:25}} />}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{ navigate('ResetNickname', {}) }}>
              <ListItem name={"名字"} rightText={me.nickname} />
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{ navigate('ResetGender', {}) }}>
              <ListItem name={"性别"} rightText={me.gender != null ? (me.gender == 1 ? '男' : '女') : ''} />
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{ navigate('ResetBiref', {}) }}>
              <ListItem name={"个性签名"} rightText={me.brief} />
            </TouchableOpacity>

            <View style={styles.gap}></View>

            {me.email || me.phone ?
              <TouchableOpacity onPress={()=>{ navigate('ResetPassword', {}) }}>
                <ListItem name={"密码"} />
              </TouchableOpacity>
              :null}

            <View style={styles.gap}></View>

            {me.email ?
              <TouchableOpacity onPress={()=>{
                if (global.unlockToken) {
                  navigate('ResetPhone', {});
                } else {
                  navigate('UnlockToken', { routeName: 'ResetEmail' });
                }
              }}>
                <ListItem name={"邮箱"} rightText={me.email} />
              </TouchableOpacity>
              : <ListItem name={"邮箱"} rightText={'未绑定'} />}

            {me.phone ?
              <TouchableOpacity onPress={()=>{
                if (global.unlockToken) {
                  navigate('ResetPhone', {});
                } else {
                  navigate('UnlockToken', { routeName: 'ResetPhone' });
                }
              }}>
                <ListItem name={"手机号"} rightText={me.phone} />
              </TouchableOpacity>
              : <TouchableOpacity onPress={()=>{
                  if (global.unlockToken) {
                    navigate('BindingPhone', {});
                  } else {
                    navigate('UnlockToken', { routeName: 'BindingPhone' });
                  }
                }}>
                <ListItem name={"手机号"} rightText={'未绑定'} />
              </TouchableOpacity>}

            <TouchableOpacity onPress={()=>{ navigate('SocialAccount', { socialName: 'qq' }) }}>
              <ListItem name={"QQ"} rightText={me.qq ? '已绑定' : '未绑定'} />
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{ navigate('SocialAccount', { socialName: 'weibo' }) }}>
              <ListItem name={"微博"} rightText={me.weibo ? '已绑定' : '未绑定'} />
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{ navigate('SocialAccount', { socialName: 'github' }) }}>
              <ListItem name={"GitHub"} rightText={me.github ? '已绑定' : '未绑定'} />
            </TouchableOpacity>

            <View style={styles.gap}></View>

            <TouchableOpacity onPress={()=>{ navigate('Block') }}>
              <ListItem name={"屏蔽设置"} />
            </TouchableOpacity>

            <View style={styles.gap}></View>

            <TouchableOpacity onPress={()=>{this.signOut()}}>
              <ListItem type="center" name={<Text style={{color:'rgb(230, 61, 61)'}}>退出当前账号</Text>} />
            </TouchableOpacity>

            <View style={{height:30}}></View>

          </View>
      </ScrollView>)
  }
}
