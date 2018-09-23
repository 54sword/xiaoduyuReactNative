import React, { Component } from 'react'
import { StyleSheet, Text, Image, View, Button, ScrollView, TextInput, Alert, TouchableOpacity, AsyncStorage, ImageBackground, PixelRatio } from 'react-native'

import { NavigationActions } from 'react-navigation'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import Wait from '../../components/ui/wait'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import { signin } from '../../actions/sign'
// import { resetPasswordByCaptcha } from '../../actions/account'
import { forgot } from '../../actions/forgot'

import gStyles from '../../styles'

import CaptchaButton from '../../components/captcha-button'

import Dimensions from 'Dimensions'
const screenWidth = Dimensions.get('window').width

class Forgot extends Component {

  static navigationOptions = ({navigation}) => ({
    // headerTitle: '通过手机号/邮箱重置密码',
    /*
    headerStyle: {
      ...ifIphoneX({
        height: 75,
        paddingTop:30,
        backgroundColor: '#4170ea',
        borderBottomWidth: 0
      }, {
        backgroundColor: '#4170ea',
        borderBottomWidth: 0
      })
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      color: '#fff'
    }
    */

    headerStyle: {
      elevation: 0,
      ...ifIphoneX({
        height: 40,
        paddingTop:20,
        backgroundColor: '#fff',
        borderBottomWidth: 0
      }, {
        backgroundColor: '#fff',
        borderBottomWidth: 0
      })
    },
    headerTintColor: '#333',
    headerTitleStyle: {
      color: '#333'
    }

  })

  constructor (props) {
    super(props)
    this.state = {
      account: '',
      password: '',
      captchaId: null,
      captcha: '',
      visible: false
    }
    this.submit = this.submit.bind(this)
    this.sendCaptcha = this.sendCaptcha.bind(this)
    this.handleSignIn = this.handleSignIn.bind(this)
  }

  sendCaptcha(callback) {

    const { account } = this.state;

    if (!account) return Alert.alert('', '请输入注册的手机号或邮箱');

    let params = { type: 'forgot' };

    if (account.indexOf('@') != -1) {
      params.email = account;
    } else {
      params.phone = account;
    }

    callback({ args: params });
  }

  handleSignIn(access_token) {

    const self = this

    AsyncStorage.setItem('token', access_token, function(errs, result){

      AsyncStorage.getItem('token', function(errs, result){

        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Main'})
          ]
        })

        global.initReduxDate(()=>{
          self.props.navigation.dispatch(resetAction)
        })

      })

    })

  }

  async submit() {

    const self = this;
    const { account, captcha, password, confirmPassword } = this.state;
    const { forgot, navigation } = this.props;
    
    if (!account) return this.refs.account.focus();
    if (!captcha) return this.refs.captcha.focus();
    if (!password) return this.refs.password.focus();
    if (!confirmPassword) return this.refs.confirmPassword.focus();
    if (password != confirmPassword) return Alert.alert('', '两次密码输入不一致');

    let args = {
      captcha: captcha,
      new_password: password
    }

    if (account.indexOf('@') != -1) {
      args.email = account;
    } else {
      args.phone = account;
    }

    let [ err, res ] = await forgot({ args });

    if (err) {
      Alert.alert(err.message);
    } else if (res && res.success) {
      Alert.alert('修改成功，请登陆');
      navigation.goBack();
    }

  }

  render() {

    // return (<ImageBackground source={require('../../images/bg.png')}  style={{ flex:1 }} resizeMode="cover">
    return (<View  style={{ flex:1, backgroundColor:'#fff' }}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps={'always'}>

        <View style={styles.title}><Text style={styles.titleText}>重置密码</Text></View>

        <TextInput
          ref="account"
          style={styles.textInput}
          autoCapitalize="none"
          onChangeText={(account) => this.setState({account})}
          placeholder='请输入账户的手机号或邮箱'
          autoFocus={true}
          underlineColorAndroid='transparent'
          // placeholderTextColor='#96d7ff'
          // selectionColor="#fff"
          />

        <View>
          <TextInput
              ref="captcha"
              style={styles.textInput}
              onChangeText={(captcha) => this.setState({captcha})}
              placeholder='请输入验证码'
              maxLength={6}
              keyboardType={'numeric'}
              underlineColorAndroid='transparent'
              // placeholderTextColor='#96d7ff'
              // selectionColor="#fff"
            />
            <View style={{
              position: 'absolute',
              marginTop: 0,
              height:45,
              justifyContent: 'center',
              marginLeft: screenWidth - 160
            }}>
              <CaptchaButton onClick={this.sendCaptcha} />
            </View>
        </View>

        <TextInput
          ref="password"
          style={styles.textInput}
          onChangeText={(password) => this.setState({password})}
          secureTextEntry={true}
          placeholder='请输入新密码'
          underlineColorAndroid='transparent'
          // placeholderTextColor='#96d7ff'
          // selectionColor="#fff"
          />

        <TextInput
          ref="confirmPassword"
          style={styles.textInput}
          onChangeText={(confirmPassword) => this.setState({confirmPassword})}
          secureTextEntry={true}
          placeholder='请再次输入新密码'
          underlineColorAndroid='transparent'
          // placeholderTextColor='#96d7ff'
          // selectionColor="#fff"
          />

        <TouchableOpacity onPress={this.submit} style={styles.button}>
          <Text style={styles.buttonText}>提交</Text>
        </TouchableOpacity>

        {this.state.visible ? <Wait /> : null}

    </ScrollView>
    </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#fff',
    flex:1,
    backgroundColor: '#fff',
    padding:30,
    paddingTop:10,
  },

  title: { marginBottom: 10, backgroundColor: 'transparent' },
  titleText: { color:'#333', fontSize:32, fontWeight:'bold' },

  input: {
    height: 40,
    borderColor: '#efefef',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10
  },
  button:{
    backgroundColor:'#63B8FF',
    height:40,
    borderRadius:20,
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    color:'#fff'
  },

  captchaContainer: {
    flexDirection: 'row'
  },
  captchaInput: {
    flex: 1
  },
  caption: {
    width:80,
    height:30,
    marginTop:5,
    marginLeft:10
  },
  itemLeft: {
    flex: 1
  },


  textInput: {
    // marginTop:15,
    // color: '#fff',
    marginBottom:10,
    borderBottomWidth:1/PixelRatio.get(),
    borderColor: '#cccccc',
    // paddingTop:15,
    // paddingBottom:15
    // padding:15,
    // paddingLeft:15,
    paddingTop:15,
    paddingBottom:15,
    fontSize: 16
    // borderRadius: 6,
    // backgroundColor: '#4c7bf5'
  },

  button: {
    marginTop:20,
    height:45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#fff',
    borderRadius: 23,
    backgroundColor:'#597fec'
  },
  buttonText: {
    color:'#fff',
    fontSize:16
  },

})

export default connect(
  (state, props) => {
    return {}
  },
  (dispatch, props) => ({
    // signin: bindActionCreators(signin, dispatch),
    forgot: bindActionCreators(forgot, dispatch)
  })
)(Forgot)
