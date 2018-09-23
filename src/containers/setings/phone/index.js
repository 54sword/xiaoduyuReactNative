import React, { Component } from 'react';
import { ScrollView, Text, View, Alert, TextInput, TouchableOpacity } from 'react-native';

// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProfile, getUnlockToken } from '../../../reducers/user';
import { loadUserInfo } from '../../../actions/user';
import { addPhone } from '../../../actions/phone';

// components
import CaptchaButton from '../../../components/captcha-button';
import SelectCountry from '../../../components/select-country';

// styles
import gStyles from '../../../styles';
import styles from './styles';


@connect(
  (state, props) => ({
    me: getProfile(state),
    unlockToken: getUnlockToken(state)
  }),
  dispatch => ({
    addPhone: bindActionCreators(addPhone, dispatch),
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch)
  })
)
export default class BindingPhone extends Component {

  static navigationOptions = {
    title: '修改手机号'
  }

  constructor (props) {
    super(props)
    this.state = {
      areaCode: '',
      submitting: false
    }
    this.submit = this.submit.bind(this)
  }

  async submit() {

    const { addPhone, loadUserInfo, unlockToken } = this.props;
    const { captcha, phone, areaCode } = this.state;
    const { navigation } = this.props;

    if (!phone) return this.refs.phone.focus();
    if (!captcha) return this.refs.captcha.focus();

    let [ err, res ] = await addPhone({
      args: {
        captcha: captcha,
        phone: phone,
        area_code: areaCode,
        unlock_token: unlockToken || ''
      }
    });

    if (res && res.success) {
      Alert.alert('', '手机号绑定成功');
      loadUserInfo({});
      navigation.goBack();
    } else if (err && err.message) {
      Alert.alert('', err.message);
    } else {
      Alert.alert('', '提交异常');
    }

  }

  sendCaptcha(callback) {

    const { me } = this.props;
    const { phone, areaCode } = this.state;

    if (!phone) return this.refs.phone.focus();
    if (!areaCode) return Alert.alert('', '请选择手机区号');

    callback({
      id: me.phone ? 'reset-phone' : 'binding-phone',
      args: {
        phone,
        area_code: areaCode,
        type: me.phone ? 'reset-phone' : 'binding-phone'
      },
      fields: `success`
    });

  }

  render() {

    const self = this
    const { me } = this.props
    const { submitting } = this.state

    return (<ScrollView style={styles.container} keyboardShouldPersistTaps="always">

                <View style={{ flexDirection: 'row', borderWidth: 1, marginTop:-1, borderColor: '#e2e2e2', paddingLeft:5, backgroundColor:'#fff' }}>
                  <View style={styles.selectCountry}>
                    <SelectCountry onChoose={res=>self.setState({ areaCode: res.code })} />
                  </View>
                  <View style={{flex:1}}>
                  <TextInput
                    ref="phone"
                    style={{ height:45, borderLeftWidth: 1, borderColor: '#e2e2e2', paddingLeft:10 }}
                    autoCapitalize="none"
                    onChangeText={(phone) => this.setState({phone})}
                    placeholder='手机号'
                    maxLength={60}
                    underlineColorAndroid='transparent'
                    />
                  </View>
                </View>

                <View>
                    <TextInput
                        ref="captcha"
                        style={gStyles.radiusInputBottom}
                        onChangeText={(captcha) => this.setState({captcha})}
                        placeholder='验证码'
                        underlineColorAndroid='transparent'
                      />

                    <View style={{
                      position: 'absolute',
                      marginTop: 0,
                      height:45,
                      justifyContent: 'center',
                      marginLeft: global.screen.width - 140
                    }}>

                    <CaptchaButton onClick={this.sendCaptcha.bind(this)} />

                  </View>
                </View>

              <TouchableOpacity onPress={this.submit} style={[gStyles.fullButton, gStyles.mt10]}>
                <Text style={gStyles.white}>{submitting ? "提交中..." : "提交"}</Text>
              </TouchableOpacity>
          </ScrollView>)
  }
}
