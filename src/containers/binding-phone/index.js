import React, { Component } from 'react'
import { StyleSheet, ScrollView, Text, View, Alert, TextInput, TouchableOpacity } from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getUserInfo } from '../../reducers/user'
import { loadUserInfo } from '../../actions/user'
import { binding } from '../../actions/phone'

import CaptchaButton from '../../components/captcha-button'
import SelectCountry from '../../components/select-country'

import gStyles from '../../styles'

class BindingPhone extends React.Component {

  static navigationOptions = {
    title: '绑定手机'
  }

  constructor (props) {
    super(props)
    this.state = {
      areaCode: '',
      submitting: false
    }
    this.submit = this.submit.bind(this)
  }

  submit() {

    const self = this
    const { binding, loadUserInfo } = this.props
    const { captcha, phone, areaCode } = this.state
    const { navigation } = this.props

    if (!phone) return this.refs.phone.focus()
    if (!captcha) return this.refs.captcha.focus()

    binding({
      data: {
        captcha: captcha,
        phone: phone,
        area_code: areaCode
      },
      callback: function(result){
        loadUserInfo({})
        alert(result.success ? '绑定成功' : '绑定失败')
        navigation.goBack()
      }
    })

  }

  sendCaptcha(callback) {

    const { phone, areaCode } = this.state

    if (!phone) return this.refs.phone.focus()
    if (!areaCode) return Alert.alert('', '请选择手机区号')

    callback({ phone: phone, area_code: areaCode, type: 'binding-phone' })
  }

  render() {

    const self = this
    const { me } = this.props
    const { submitting } = this.state

    return (<ScrollView style={styles.container} keyboardShouldPersistTaps="always">

                <View style={{ flexDirection: 'row', borderWidth: 1, marginTop:-1, borderColor: '#e2e2e2', paddingLeft:10, backgroundColor:'#fff' }}>
                  <View>
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
                        marginLeft: global.screen.width - 150
                      }}>
                    <CaptchaButton sendCaptcha={this.sendCaptcha.bind(this)} />
                  </View>
                </View>

              <TouchableOpacity onPress={this.submit} style={[gStyles.fullButton, gStyles.mt10]}>
                <Text style={gStyles.white}>{submitting ? "提交中..." : "提交"}</Text>
              </TouchableOpacity>
          </ScrollView>)
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    padding:20
  }
})

export default connect(state => ({
    me: getUserInfo(state)
  }),
  (dispatch) => ({
    binding: bindActionCreators(binding, dispatch),
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch)
  })
)(BindingPhone);
