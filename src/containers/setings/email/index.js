import React, { Component } from 'react'
import { StyleSheet, ScrollView, Text, View, Alert, Image, TextInput, TouchableOpacity } from 'react-native'

// import { NavigationActions } from 'react-navigation'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getProfile, getUnlockToken } from '../../../reducers/user'
import { loadUserInfo } from '../../../actions/user'
// import { addEmail } from '../../actions/account'
import { addEmail } from '../../../actions/account';


import { ListItem } from '../../../components/ui'
import CaptchaButton from '../../../components/captcha-button'

import gStyles from '../../../styles'

class ResetEmail extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { title } = navigation.state.params
    return { title }
  }

  static navigationOptions = {
    title: '绑定邮箱'
  }

  constructor (props) {
    super(props)
    this.state = {
      submitting: false
    }
    this.submit = this.submit.bind(this)
  }

  componentWillMount() {

    const { me } = this.props;

    this.props.navigation.setParams({
      title: me.email ? '修改邮箱' : '绑定邮箱'
    })

  }

  async submit() {

    const self = this
    const { unlockToken, addEmail, loadUserInfo } = this.props
    const { email, captcha, submitting } = this.state
    const { navigation } = this.props

    if (submitting) return
    if (!email) return Alert.alert('', '请输入你的邮箱')
    if (!captcha) return Alert.alert('', '请输入你的验证码')

    self.setState({ submitting: true });

    let [ err, res ] = await addEmail({
      args: {
        email,
        captcha,
        unlock_token: unlockToken || ''
      }
    });

    self.setState({ submitting: true });

    if (res && res.success) {
      await loadUserInfo({});
      navigation.goBack();
      return;
    }

    Alert.alert('', err && err.message ? err.message : err);
  }

  sendCaptcha(callback) {

    const { me } = this.props;
    const { email } = this.state;
    if (!email) return Alert.alert('', '请输入新邮箱');

    callback({
      id: me.email ? 'reset-email' : 'binding-email',
      args: {
        email: email,
        type: me.email ? 'reset-email' : 'binding-email',
      },
      fields: `success`
    });

  }

  render() {

    const { me } = this.props
    const { submitting } = this.state

    return (<ScrollView style={styles.container} keyboardShouldPersistTaps="always">
              <TextInput
                style={gStyles.radiusInputTop}
                autoCapitalize="none"
                onChangeText={(email) => this.setState({email})}
                placeholder='请输入你的新邮箱'
                autoFocus={true}
                underlineColorAndroid='transparent'
                />

                <View>
                    <TextInput
                        style={gStyles.radiusInputBottom}
                        onChangeText={(captcha) => this.setState({captcha})}
                        placeholder='验证码'
                        underlineColorAndroid='transparent'
                      />

                    <View style={{
                      position: 'absolute',
                      marginTop: 7,
                      // height:45,
                      // justifyContent: 'center',
                      marginLeft: global.screen.width - 135
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

const styles = StyleSheet.create({
  container:{
    flex: 1,
    padding:15
  }
})

export default connect(state => ({
    me: getProfile(state),
    unlockToken: getUnlockToken(state)
  }),
  (dispatch) => ({
    addEmail: bindActionCreators(addEmail, dispatch),
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch)
  })
)(ResetEmail)
