import React, { Component } from 'react'
import { StyleSheet, View, NativeModules, Platform } from 'react-native'
import { apiDomain, officialWebsite, api_url } from '../../../config'
import { WebView } from "react-native-webview";

import CookieManager from 'react-native-cookies';

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

    this.webview = React.createRef();

    this.onNavigationStateChange = this.onNavigationStateChange.bind(this)
  }

  onNavigationStateChange(navState) {

    let { successCallback =()=>{}, failCallback =()=>{} } = this.props.navigation.state.params
    const { navigation } = this.props

    if (navState.url && navState.url.indexOf(officialWebsite+'/oauth?access_token=') != -1) {

      let params = parseUrl(navState.url) || {};

      successCallback(params.access_token || '', params.expires || null);
      navigation.goBack()
    } else if (navState.url && navState.url.indexOf(officialWebsite+'/notice?') != -1) {

      let result = GetQueryString(navState.url, 'notice')

      if (result == 'binding_finished') {
        successCallback(result)
      } else {
        failCallback(result)
      }

      navigation.goBack()
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    CookieManager.clearAll();
  }
  
  render() {

    const { accessToken, name } = this.props.navigation.state.params;

    return (<View style={styles.container}>
      <WebView
        ref={this.webview}
        source={{uri: `${apiDomain}/oauth/${name}${accessToken ? '?access_token='+accessToken : ''}`}}
        onNavigationStateChange={this.onNavigationStateChange}
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
