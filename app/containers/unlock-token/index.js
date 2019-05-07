import React, { Component } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';

import { ifIphoneX } from 'react-native-iphone-x-helper';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getUnlockToken } from '../../store/actions/unlock-token';
import { getProfile } from '../../store/reducers/user';

// components
import CaptchaButton from '../../components/captcha-button'

import styles from './styles';
const gStyles = global.styles;

@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
    getUnlockToken: bindActionCreators(getUnlockToken, dispatch)
  })
)
export default class UnlockToken extends Component {

  static navigationOptions = ({navigation}) => {
    return {

      title: '',

      headerLeft: (<TouchableOpacity style={{padding:15,marginLeft:5}} onPress={()=>{
        navigation.navigate('App');
      }}>
        <Image source={require('../../global/images/close.png')} style={{width:20,height:20}} resizeMode="cover" />
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

  constructor(props) {
    super(props)
    this.state = {
      areaCode: ''
    }
    this.submit = this.submit.bind(this)
    this.sendCaptcha = this.sendCaptcha.bind(this)
  }

  componentWillMount() {
    const { me } = this.props;
    if (me.email) this.state.type = 'email';
    if (me.phone) this.state.type = 'phone';
  }

  async submit() {

    const self = this
    const { getUnlockToken } = this.props
    const { type, captcha } = this.state;
    const { navigate } = this.props.navigation;
    // const { select, captcha } = this.refs

    if (!captcha) return this.refs.captcha.focus();

    let [ err, res ] = await getUnlockToken({
      args: { type, captcha }
    });

    if (err) {
      // global.unlockToken = false;
      Alert.alert(err.message);
      return;
    }

    // global.unlockToken = true;

    navigate('App');

    const { routeName } = this.props.navigation.state.params;
    if (routeName) navigate(routeName);

  }

  sendCaptcha(callback) {

    const { type } = this.state;

    callback({
      id: 'unlock-token',
      args: {
        type: type == 'phone' ? 'phone-unlock-token' : 'email-unlock-token'
      },
      fields: `success`
    });

  }

  render () {

    const self = this;
    const { me } = this.props;
    const { type } = this.state;

    return (<ScrollView style={styles.container}>

          <View style={styles.title}>
            <Text style={styles.titleText}>身份验证</Text>
          </View>

          <View style={{marginBottom:20}}>
            <Text style={{lineHeight:26, fontSize:16}}>为了保护你的帐号安全，请验证身份，验证成功后进行下一步操作</Text>
          </View>

          <View>
            {me.phone ?
              <TouchableOpacity
              style={styles.selectItem}
              onPress={()=>{
                self.setState({ type:'phone' });
              }}>
              <Image source={type == 'phone' ? require('../../global/images/select/active.png') : require('../../global/images/select/general.png')} style={{width:20,height:20,marginRight:5}} resizeMode="cover" />
              <Text style={type == 'phone' ? styles.active : null}>使用 {me.phone} 验证</Text></TouchableOpacity>
              : null}
            {me.email ?
              <TouchableOpacity
              style={styles.selectItem}
              onPress={()=>{
                self.setState({ type:'email' });
              }}>
              <Image source={type == 'email' ? require('../../global/images/select/active.png') : require('../../global/images/select/general.png')} style={{width:20,height:20,marginRight:5}} resizeMode="cover" />
              <Text style={type == 'email' ? styles.active : null}>使用 {me.email} 验证</Text></TouchableOpacity>
              : null}
          </View>

          <View style={{marginTop:30}}>
            <TextInput
              ref="captcha"
              onChangeText={(captcha) => this.setState({captcha})}
              style={styles.input}
              placeholder='输入6位数验证码'
              underlineColorAndroid='transparent'
              autoFocus={true}
              />

            <View style={{
              position: 'absolute',
              // marginTop: 20,
              height:45,
              justifyContent: 'center',
              marginLeft: global.screen.width - 160
            }}>
              <CaptchaButton onClick={this.sendCaptcha} />
            </View>

          </View>

          <TouchableOpacity style={styles.button} onPress={this.submit}>
            <Text style={styles.buttonText}>提交</Text>
          </TouchableOpacity>

        </ScrollView>)
  }
}
