import React, { Component } from 'react'
import { StyleSheet, Modal, Text, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, ScrollView, View, TextInput, Image, Keyboard } from 'react-native'

import CaptchaButton from '../captcha-button'
import Dimensions from 'Dimensions'
const screenWidth = Dimensions.get('window').width

// var dismissKeyboard = require('dismissKeyboard');

import gStyles from '../../styles'


// Keyboard.removeAllListeners('keyboardDidHide')
// // not totally necessary and may be harmful if you do this in more than one location, works for my case
// Keyboard.addListener('keyboardDidHide', () => { console.log('123'); })
// // checkSubmit is a function the pulls up the modal
// Keyboard.dismiss()

class ModalBindingPhone extends Component {

  constructor(props) {
    super(props);
    this.state = {modalVisible: false, status: 0 };
    this.sendCaptcha = this.sendCaptcha.bind(this)
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  sendCaptcha(callback) {

    const { account } = this.state

    if (!account) return Alert.alert('', '请输入注册的手机号或邮箱')

    let params = { type: 'forgot' }

    if (account.indexOf('@') != -1) {
      params.email = account
    } else {
      params.phone = account
    }

    callback(params)

  }

  componentWillMount() {
    const self = this
    const { show, hide } = this.props
    show(()=>{ this.setModalVisible(true) })
    hide(()=>{ this.setModalVisible(false) })
    // this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    // this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }
  //
  // componentWillUnmount() {
  //         this.keyboardDidShowListener.remove();
  //         this.keyboardDidHideListener.remove();
  // }
  // _keyboardDidShow () {
  //
  // }
  // _keyboardDidHide () {
  //          dismissKeyboard();
  // }

  render() {

    const self = this

    return (

        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.modalVisible}
          >
            <ScrollView keyboardShouldPersistTaps="always">
          <View style={styles.modal}>
            <View style={styles.main} >

            <View style={styles.close}>
              <TouchableHighlight onPress={()=>{ console.log(123); self.setModalVisible(false) }}>
                <Image source={require('./images/close.png')} style={styles.closeIcon} />
              </TouchableHighlight>
            </View>

            <View style={styles.title}>
              <Text style={styles.titleText}>绑定手机号</Text>
            </View>
            
            <Text>亲爱的用户，应2017年10月1日起实施的《中华人民共和国网络安全法》要求，网站须强化用户实名认证机制。您需要验证手机方可使用社区功能，烦请您将账号与手机进行绑定。</Text>

            <View style={styles.body}>
              <TextInput
                  ref="phone"
                  style={gStyles.radiusInputTop}
                  autoCapitalize="none"
                  onChangeText={(phone) => this.setState({phone})}
                  placeholder='手机号'
                  keyboardShouldPersistTaps={'handled'}
                  onEndEditing={()=>{

                    console.log(self.state.status);

                    if (self.state.status == 1) {
                      // self.setModalVisible(false)
                    }
                    // console.log('2222');
                    // self.refs.phone.blur()
                    // this.endEdit()
                  }}
                />

              <View>
                <TextInput
                    style={gStyles.radiusInputBottom}
                    onChangeText={(captcha) => this.setState({captcha})}
                    placeholder='验证码'

                  />
                  <View style={{
                    position: 'absolute',
                    marginTop: 0,
                    height:45,
                    justifyContent: 'center',
                    marginLeft: screenWidth - 150 - 50
                  }}>
                    <CaptchaButton sendCaptcha={this.sendCaptcha} />
                  </View>
              </View>

              <TouchableOpacity style={[gStyles.fullButton, gStyles.mt20]}>
                <Text style={gStyles.white}>登录</Text>
              </TouchableOpacity>

            </View>

            </View>
          </View>

        </ScrollView>
        </Modal>


    )
  }
}

ModalBindingPhone.defaultProps = {
  show: ()=>{},
  hide: ()=>{}
}

const styles = StyleSheet.create({
  modal: {
    flex:1,
    padding:20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems:'center',
    justifyContent: 'center'
  },
  main: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding:20
  },
  title: {
    // paddingTop:40,
    paddingBottom:10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    fontSize: 24
  },
  body: {
    paddingTop:20,
    paddingBottom:20
  },
  button: {
    backgroundColor: '#333'
  },
  close:{
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop:-35,
    marginRight:-35
  },
  closeIcon: {
    width:50,
    height:50
  }
})

export default ModalBindingPhone
