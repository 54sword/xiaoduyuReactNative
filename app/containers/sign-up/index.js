

import React, { Component } from 'react'
import { StyleSheet, Text, Image, View, ScrollView, TextInput, Alert, TouchableOpacity, ImageBackground, Platform } from 'react-native'

import AsyncStorage from '@react-native-community/async-storage';

import { NavigationActions } from 'react-navigation'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { signUp, signIn } from '../../store/actions/sign'
// import gStyles from '../../styles'
import CaptchaButton from '../../components/captcha-button'
import SelectCountry from '../../components/select-country'

import SocialSignIn from '../sign-in/components/social-sign-in';

import KeyboardSpacer from 'react-native-keyboard-spacer'
import Wait from '../../components/ui/wait'

import Dimensions from 'Dimensions'
const screenWidth = Dimensions.get('window').width


import styles from './styles'


/*
import { Query } from "react-apollo";
import gql from "graphql-tag";

<Query
  query={gql`
    {
      countries {
        code
        name
        abbr
      }
    }
  `}
>
  {({ loading, error, data }) => {
    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error :(</Text>;
    return data.countries.map(({ name, code }) => (
      <View key={code}>
        <Text>{`${name + code}`}</Text>
      </View>
    ));
  }}
</Query>
*/

@connect(
  (state, props) => ({
  }),
  dispatch => ({
    signUp: bindActionCreators(signUp, dispatch),
    signIn: bindActionCreators(signIn, dispatch)
  })
)
export default class SignUp extends Component {

  static navigationOptions = ({navigation}) => ({
    // headerTitle: '注册',
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
      error: {},
      visible: false,
      areaCode: '',
      submitting: false
    }
    this.submit = this.submit.bind(this)
    this.sendCaptcha = this.sendCaptcha.bind(this)
    this.handleSignIn = this.handleSignIn.bind(this)
  }

  async submit() {

    if (this.state.submitting) return;

    const { nickname, account, password, captcha, areaCode } = this.state;
    const { signUp, signIn, navigation } = this.props;

    if (!nickname) return this.refs.nickname.focus();
    if (nickname.replace(/(^\s+)|(\s+$)/g, '') == '') return Alert.alert('', '名字不能都是空格');
    if (!areaCode) return Alert.alert('', '请选择区号');
    if (!account) return this.refs.phone.focus();
    if (!captcha) return this.refs.captcha.focus();
    if (!password) return this.refs.password.focus();
    // if (!gender) return Alert.alert('', '请选择性别')

    this.setState({ visible: true });

    this.state.submitting = true;

    let data = { nickname, password, source: 5, captcha }

    if (account.indexOf('@') != -1) {
      data.email = account;
    } else {
      data.phone = account;
      data.area_code = areaCode;
    }

    let [ err, res ] = await signUp(data);

    this.state.submitting = false;
    this.setState({ visible: false });

    if (err) {
      Alert.alert('', err.message);
      return
    }

    Alert.alert('注册成功');

    navigation.goBack();
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

  sendCaptcha(callback) {

    const { account, areaCode } = this.state;

    if (!areaCode) return Alert.alert('', '请输入手机区号未选择');
    if (!account) return Alert.alert('', '请输入手机号');

    let params = { type: 'sign-up' }

    if (account.indexOf('@') != -1) {
      params.email = account;
    } else {
      params.area_code = areaCode;
      params.phone = account;
    }

    callback({ args: params });
  }

  render() {

    const self = this
    const { captchaId } = this.state
    const { nickname, phone, password, captcha } = this.state.error
    const { navigate } = this.props.navigation

    // return (<ImageBackground source={require('../../images/bg.png')}  style={{ flex:1 }} resizeMode="cover">
    return (
      <ScrollView style={styles.container} keyboardShouldPersistTaps={'always'}>

      <View style={styles.title}><Text style={styles.titleText}>创建账号</Text></View>

      <View>

        <TextInput
          style={styles.textInput}
          onChangeText={(nickname) => this.setState({nickname})}
          placeholder='名字'
          ref="nickname"
          maxLength={40}
          underlineColorAndroid='transparent'
          // placeholderTextColor='#96d7ff'
          // selectionColor="#fff"
          />
          
        {nickname ? <View style={styles.tip}><Text style={styles.tipText}>{nickname}</Text></View> : null}

        <View style={{ flexDirection: 'row' }}>
          <View>
            <View style={styles.selectCountry}>
              <SelectCountry
                onChoose={(res)=>{
                  console.log(res)
                  console.log('====');
                  // self.setState({ areaCode: res.code })
                }}
                />
            </View>
          </View>
          <View style={{flex:1}}>
          <TextInput
            // style={{ height:45, borderLeftWidth: 1, borderColor: '#e2e2e2', paddingLeft:10 }}
            style={[styles.textInput, { borderTopLeftRadius:0, borderBottomLeftRadius: 0 } ]}
            autoCapitalize="none"
            onChangeText={(account) => this.setState({account})}
            placeholder='手机号'
            ref="phone"
            maxLength={60}
            underlineColorAndroid='transparent'
            // placeholderTextColor='#96d7ff'
            // selectionColor="#fff"
            />
          </View>
        </View>

        {phone ? <View style={styles.tip}><Text style={styles.tipText}>{phone}</Text></View> : null}

        <View>
          <TextInput
            style={styles.textInput}
            onChangeText={(captcha) => this.setState({captcha})}
            placeholder='验证码'
            ref="captcha"
            maxLength={6}
            keyboardType={'numeric'}
            underlineColorAndroid='transparent'
            // placeholderTextColor='#96d7ff'
            // selectionColor="#fff"
            />
          <View style={{
            position: 'absolute',
            marginTop: 0,
            // backgroundColor:'#fff',
            height:50,
            justifyContent: 'center',
            marginLeft: screenWidth - 160
          }}>
            <CaptchaButton onClick={this.sendCaptcha} />
          </View>
        </View>

        {captcha ? <View style={styles.tip}><Text style={styles.tipText}>{captcha}</Text></View> : null}

        <TextInput
          style={styles.textInput}
          onChangeText={(password) => this.setState({password})}
          secureTextEntry={true}
          placeholder='密码'
          maxLength={30}
          ref="password"
          underlineColorAndroid='transparent'
          // placeholderTextColor='#96d7ff'
          // selectionColor="#fff"
          />

        {password ? <View style={styles.tip}><Text style={styles.tipText}>{password}</Text></View> : null}

        <TouchableOpacity onPress={this.submit} style={styles.button}>
          <Text style={styles.buttonText}>注册</Text>
        </TouchableOpacity>

    </View>

    <View style={styles.protocol}>
      <Text style={styles.protocolText}>轻点“注册”，即表示您同意小度鱼</Text>
      <Text style={[styles.protocolText, {color:'#597fec',marginLeft:5}]} onPress={()=>{ navigate('Agreement') }}>
        用户协议
      </Text>
    </View>

    <View style={{marginBottom:15}}>
      <SocialSignIn handleSignIn={this.handleSignIn} />
    </View>

    {this.state.visible ? <Wait /> : null}

    {Platform.OS === 'android' ? null : <KeyboardSpacer />}

    </ScrollView>)
  }
}

/*
export default connect(
  (state, props) => {
    return {}
  },
  (dispatch, props) => ({
    signUp: bindActionCreators(signUp, dispatch),
    signIn: bindActionCreators(signIn, dispatch)
  })
)(SignUp)
*/
