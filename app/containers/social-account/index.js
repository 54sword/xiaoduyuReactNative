import React, { Component } from 'react'
import { StyleSheet, Text, View, Alert, Image, TextInput, Button, TouchableOpacity, DeviceEventEmitter, ActivityIndicator } from 'react-native'
// import * as QQAPI from 'react-native-qq'
import * as QQAPI from 'react-native-qq';

import { ifIphoneX } from 'react-native-iphone-x-helper';
import { Toast } from 'teaset';



import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadUserInfo } from '../../store/actions/user'
import { getProfile, getAccessToken } from '../../store/reducers/user'
import { oAuthUnbinding, QQOAuth } from '../../store/actions/oauth'


// import { weiboGetUserInfo, QQGetUserInfo } from '../../actions/oauth'
// import openShare from 'react-native-open-share'
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import { ListItem } from '../../components/ui'

class SocialAccount extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state

    let title = ''

    switch (params.socialName) {
      case 'qq': title = '腾讯QQ'; break;
      case 'weibo': title = '微博'; break;
      case 'github': title = 'GitHub'; break;
    }

    return {
      title: title
    }
  }

  constructor (props) {
    super(props)
    this.state = {}
    this.showActionSheet = this.showActionSheet.bind(this)
    this.chooseSheet = this.chooseSheet.bind(this)
  }

  showActionSheet() {
    this.ActionSheet.show()
  }

  async chooseSheet(key) {
    if (!key) return

    const { me, accessToken } = this.props
    const { socialName } = this.props.navigation.state.params
    const { oAuthUnbinding, loadUserInfo } = this.props
    const { navigate } = this.props.navigation

    let binding = me[socialName];

    if (binding) {

      // 解除绑定
      let [ err, res ] = await oAuthUnbinding({
        args: { name: socialName }
      });

      await loadUserInfo({});
      return
    }

    if (socialName == 'qq') {
      QQAPI.login().then(async result=>{
        
        let loading = Toast.show({
          text: '请求中...',
          icon: <ActivityIndicator size='large' />,
          position: 'center',
          duration: 1000 * 60
        });

        let [ err, res ] = await this.props.QQOAuth(result);

        if (res && res.success) {
          await loadUserInfo({});
          Toast.hide(loading);
          Toast.success('绑定成功');
        } else {
          Toast.hide(loading);
          Toast.fail('绑定失败');
        }
        
      });
      return;
    }

    // 绑定
    navigate('OtherSignIn', {
      successCallback: async token => {
        await loadUserInfo({});
        Toast.success('绑定成功');
      },
      failCallback: res => {
        Toast.fail('绑定失败');
      },
      accessToken,
      name: socialName
    });

  }

  render() {
    const { me, accessToken } = this.props
    const { socialName } = this.props.navigation.state.params

    let name = ''

    switch (socialName) {
      case 'qq': name = '腾讯QQ'; break;
      case 'weibo': name = '微博'; break;
      case 'github': name = 'GitHub'; break;
    }

    return (<View style={styles.container}>

      <TouchableOpacity onPress={this.showActionSheet}>
        <ListItem type="center" name={(me[socialName] ? '已绑定' : '绑定') + name } />
      </TouchableOpacity>

      <ActionSheet
        ref={o => this.ActionSheet = o}
        title={me[socialName] ? '解除绑定后，您将无法通过该 '+name+' 账户登陆' : '绑定后，您将可以通过该 '+name+' 账户登陆'}
        options={['取消', me[socialName] ? '解除绑定' : '绑定']}
        cancelButtonIndex={0}
        destructiveButtonIndex={0}
        onPress={this.chooseSheet}
        styles={{
          ...ifIphoneX({
            cancelButtonBox: { paddingBottom:20, height:65 }
          }, {})
        }}
      />

    </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop:10
  }
})

export default connect(state => ({
    me: getProfile(state),
    accessToken: getAccessToken(state)
  }),
  (dispatch) => ({
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch),
    oAuthUnbinding: bindActionCreators(oAuthUnbinding, dispatch),
    QQOAuth: bindActionCreators(QQOAuth, dispatch)
    // unbindingSocialAccount: bindActionCreators(unbindingSocialAccount, dispatch),
    // weiboGetUserInfo: bindActionCreators(weiboGetUserInfo, dispatch),
    // QQGetUserInfo: bindActionCreators(QQGetUserInfo, dispatch)
  })
)(SocialAccount);
