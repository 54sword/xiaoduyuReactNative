import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, Image, TouchableOpacity, Platform } from 'react-native';
// import Platform from 'Platform';
// import { StackActions, NavigationActions } from 'react-navigation';
// import JPushModule from 'jpush-react-native'
// import * as JPush from '../../common/jpush';

// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProfile, getUnlockToken } from '../../store/reducers/user';
import { removeAccessToken } from '../../store/actions/user';
import { getClientInstalled } from '../../store/reducers/client-installed';
// import { cleanAllData } from '../../store/actions/sign';

// components
import { ListItem } from '../../components/ui';

// styles
import styles from './style';

@connect(
  (state, props) => ({
    me: getProfile(state),
    clientInstalled: getClientInstalled(state),
    unlockToken: getUnlockToken(state)
  }),
  dispatch => ({
    removeAccessToken: bindActionCreators(removeAccessToken, dispatch)
  })
)
export default class AccountAndSecurity extends React.Component {

  static navigationOptions = {
    title: '账号与安全'
  }

  constructor (props) {
    super(props)
    this.state = {
      qq: false,
      weibo: false
    }
  }

  render() {

    const { me, clientInstalled, unlockToken } = this.props;
    const { navigate } = this.props.navigation;

    if (!me) return null;
    
    return (<ScrollView style={styles.container}>
          <View style={styles.main}>

          {me.email || me.phone ?
              <TouchableOpacity onPress={()=>{
                if (unlockToken) {
                  navigate('ResetPassword', {});
                } else {
                  navigate('UnlockToken', { routeName: 'ResetPassword' });
                }
              }}>
                <ListItem name={"密码"} />
              </TouchableOpacity>
              :null}

            <View style={styles.gap}></View>

            {me.email ?
              <TouchableOpacity onPress={()=>{
                if (unlockToken) {
                  navigate('ResetEmail', {});
                } else {
                  navigate('UnlockToken', { routeName: 'ResetEmail' });
                }
              }}>
                <ListItem name={"邮箱"} rightText={me.email} />
              </TouchableOpacity>
              : <ListItem name={"邮箱"} rightText={'未绑定'} />}

            {me.phone ?
              <TouchableOpacity onPress={()=>{
                if (unlockToken) {
                  navigate('ResetPhone', {});
                } else {
                  navigate('UnlockToken', { routeName: 'ResetPhone' });
                }
              }}>
                <ListItem name={"手机号"} rightText={me.phone} />
              </TouchableOpacity>
              : <TouchableOpacity onPress={()=>{
                  if (unlockToken) {
                    navigate('BindingPhone', {});
                  } else {
                    navigate('UnlockToken', { routeName: 'BindingPhone' });
                  }
                }}>
                <ListItem name={"手机号"} rightText={'未绑定'} />
              </TouchableOpacity>}

            <View style={styles.gap}></View>

            <TouchableOpacity onPress={()=>{ navigate('SocialAccount', { socialName: 'qq' }) }}>
              <ListItem name={"QQ"} rightText={me.qq ? '已绑定' : '未绑定'} />
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{ navigate('SocialAccount', { socialName: 'weibo' }) }}>
              <ListItem name={"微博"} rightText={me.weibo ? '已绑定' : '未绑定'} />
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{ navigate('SocialAccount', { socialName: 'github' }) }}>
              <ListItem name={"GitHub"} rightText={me.github ? '已绑定' : '未绑定'} />
            </TouchableOpacity>

          </View>
      </ScrollView>)
  }
}
