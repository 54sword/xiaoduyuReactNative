

import React, { Component } from 'react'
import { StyleSheet, View, WebView, NativeModules } from 'react-native'
import { original_api_domain, official_website, api_url } from '../../../config'

import Cookie from 'react-native-cookie';

function GetQueryString(url, name) {
   var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
   var r = url.substr(1).match(reg);
   if(r!=null)return  unescape(r[2]); return null;
}


const parseUrl = (search) => {

  if (search.indexOf('?') != -1) {
    search = search.split('?')[search.split('?').length - 1];
  }

  const paramPart = search.split('&');

  return paramPart.reduce(function(res, item) {
    if (item) {
      let parts = item.split('=')
      res[parts[0]] = parts[1] || ''
    }
    return res
  }, {});

}

class OtherSignIn extends Component {

  static navigationOptions = ({navigation}) => {

    const { name } = navigation.state.params

    let headerTitle = ''

    if (name == 'github') {
      headerTitle = 'GitHub 登陆'
    } else if (name == 'qq') {
      headerTitle = 'QQ 登陆'
    } else if (name == 'weibo') {
      headerTitle = '微博登陆'
    }

    return {
      headerTitle: headerTitle
    }
  }

  constructor (props) {
    super(props)
    this.onNavigationStateChange = this.onNavigationStateChange.bind(this)
  }

  onNavigationStateChange(navState) {

    let { successCallback =()=>{}, failCallback =()=>{} } = this.props.navigation.state.params
    const { navigation } = this.props

    if (navState.url && navState.url.indexOf(official_website+'/oauth?access_token=') != -1) {

      let params = parseUrl(navState.url) || {};

      successCallback(params.access_token || '', params.expires || null);
      navigation.goBack()
    } else if (navState.url && navState.url.indexOf(official_website+'/notice?') != -1) {

      let result = GetQueryString(navState.url, 'notice')

      if (result == 'binding_finished') {
        successCallback(result)
      } else {
        failCallback(result)
      }

      navigation.goBack()
    }
  }

  componentWillUnmount() {
    Cookie.clear();
  }

  render() {

    const { accessToken, name } = this.props.navigation.state.params

    return (<View style={styles.container}>
      <WebView
        ref={'webview'}
        automaticallyAdjustContentInsets={false}
        source={{uri: `${original_api_domain}/oauth/${name}${accessToken ? '?access_token='+accessToken : ''}`}}
        javaScriptEnabled={true}
        onNavigationStateChange={this.onNavigationStateChange}
        startInLoadingState={true}
        scalesPageToFit={true}
        thirdPartyCookiesEnabled={true}
      />
    </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  }
})

export default OtherSignIn
