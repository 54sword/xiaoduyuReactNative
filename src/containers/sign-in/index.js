
import React, { Component } from 'react';
import { Text, Image, View, ScrollView, TextInput, Alert, TouchableOpacity, AsyncStorage, ImageBackground, Keyboard } from 'react-native';

// package
import { StackActions, NavigationActions } from 'react-navigation';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import { RNToasty } from 'react-native-toasty';

// components
import Wait from '../../components/ui/wait';
import HeadButton from '../../components/ui/head-button';

import SocialSignIn from './components/social-sign-in';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { signIn } from '../../actions/sign';
import { addCaptcha } from '../../actions/captcha';
import { getCaptchaById } from '../../reducers/captcha';

// config
import { api_url, api_verstion } from '../../../config';

// styles
import styles from './styles';

@connect(
  (state, props) => ({
    captcha: getCaptchaById(state, 'sign-in')
  }),
  dispatch => ({
    signIn: bindActionCreators(signIn, dispatch),
    addCaptcha: ()=>{
      return bindActionCreators(addCaptcha, dispatch)({
        id: 'sign-in',
        args: {
          type: 'sign-in'
        },
        fields: `
          success
          _id
          url
        `
      })
    }
  })
)
export default class SignInPage extends Component {

  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      headerLeft: (<TouchableOpacity style={{padding:15,marginLeft:5}} onPress={()=>{
        navigation.navigate('App');
      }}>
        <Image source={require('../../global/images/close.png')} style={{width:20,height:20}} resizeMode="cover" />
      </TouchableOpacity>),
      headerRight: (<TouchableOpacity onPress={()=>params.toSignUp()} style={{marginRight:15}}>
        <Text style={{color:'#597fec',fontWeight:'bold',fontSize:17}}>创建账号</Text>
      </TouchableOpacity>),
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
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      account: '',
      password: '',
      captchaId: null,
      captcha: '',
      visible: false,
      error: '',
      submitting: false
    }
    this.submit = this.submit.bind(this);
    this.loadCaptcha = this.loadCaptcha.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
  }

  componentWillMount() {

    // 加载验证码
    this.loadCaptcha();

    // 导航添加忘记密码
    const { navigate } = this.props.navigation;
    this.props.navigation.setParams({
      toSignUp: () => navigate('SignUp')
    });
  }

  loadCaptcha() {
    this.props.addCaptcha();
  }

  handleSignIn(access_token, expires = (new Date().getTime() + 1000 * 60 * 60 * 24 * 30) + '') {

    const self = this;
    const { navigate } = this.props.navigation;
    const { routeName, setParams, onSignInFinish = ()=>{} } = this.props.navigation.state.params || {};

    AsyncStorage.setItem('token', access_token, (errs, result) => {
    AsyncStorage.setItem('token_expires', expires, async (errs, result) => {

      await global.initialAppDate();

      navigate('App');

      let options = {
        routeName: 'Entrance',
        params: {}
      }

      if (routeName) options.params.jumpToRouteName = routeName;
      if (setParams) options.params.setParams = setParams;
      if (onSignInFinish) options.params.callback = onSignInFinish;

      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate(options)]
      });

      this.props.navigation.dispatch(resetAction);

    })
    });

  }

  async submit() {

    const { account, password, captcha } = this.state;
    const { signIn, navigation } = this.props;
    const { navigate } = this.props.navigation;

    if (!account) return this.refs.account.focus();
    if (!password) return this.refs.password.focus();
    if (this.refs.captcha && !captcha) return this.refs.captcha.focus();

    let data = { password }

    if (account.indexOf('@') != -1) {
      data.email = account;
    } else {
      data.phone = account;
    }

    if (captcha) data.captcha = captcha;
    if (this.props.captcha) data.captcha_id = this.props.captcha._id;

    this.setState({ visible: true, error: '' });

    if (this.state.submitting) return;

    this.state.submitting = true;

    let [ err, res ] = await signIn({ data });

    this.state.submitting = false;

    if (err) {
      this.loadCaptcha();
      this.setState({ error: err });
    } else if (res && res.access_token) {
      this.handleSignIn(res.access_token, res.expires);
    }

    this.setState({ visible: false });
  }

  render() {

    const self = this;
    const { captchaId, visible, error } = this.state;
    const { navigate } = this.props.navigation;
    const { captcha } = this.props;

    return (<TouchableOpacity style={styles.container} activeOpacity={1} onPress={Keyboard.dismiss}>

      <View style={styles.title}><Text style={styles.titleText}>登陆</Text></View>

      {error ? <View style={styles.error}><Text style={styles.errorText}>{error || '账号或密码错误'}</Text></View> : null}

      <TextInput
        ref="account"
        style={styles.textInput}
        autoCapitalize={'none'}
        onChangeText={(account) => this.setState({account})}
        placeholder='请输入手机号或邮箱'
        // autoFocus={true}
        maxLength={60}
        underlineColorAndroid='transparent'
        // placeholderTextColor='#96d7ff'
        // selectionColor="#fff"
        />

      <TextInput
        ref="password"
        style={styles.textInput}
        onChangeText={(password) => this.setState({password})}
        secureTextEntry={true}
        placeholder='请输入密码'
        maxLength={60}
        underlineColorAndroid='transparent'
        // placeholderTextColor='#96d7ff'
        // selectionColor="#fff"
        />

        {captcha ?
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
            <TouchableOpacity onPress={this.loadCaptcha}
              style={{
                position: 'absolute',
                marginTop: 12,
                marginLeft: global.screen.width - 130
              }}
              >
              <Image source={{ uri: captcha.url }} style={{ width:80, height:30 }}  />
            </TouchableOpacity>
          </View>
          : null}

      <TouchableOpacity onPress={this.submit} style={styles.button}>
        <Text style={styles.buttonText}>登录</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{padding:20,justifyContent:'center',alignItems:'center'}}
        onPress={()=>navigate('Forgot')}>
        <Text style={{color:'#597fec',fontSize:16}}>忘记密码？找回密码</Text>
      </TouchableOpacity>

      <View style={{flex:1}}></View>

      <SocialSignIn handleSignIn={this.handleSignIn} />

      {visible ? <Wait /> : null}

    </TouchableOpacity>)
  }
}
