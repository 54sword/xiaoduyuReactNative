
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { addCaptcha } from '../../actions/captcha'



class CaptchaButton extends Component {

  static propTypes = {
    // 点击是回调事件，并将本组件的send方法作为参数发给该方法
    onClick: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      countdown: 0,
      isMount: true
    }
    this.send = this.send.bind(this);
  }

  componentWillUnmount() {
    this.state.isMount = false;
  }

  async send(data) {

    const { addCaptcha } = this.props;
    let { loading, countdown } = this.state;

    if (loading || countdown > 0) return;

    this.setState({ loading: true });

    let [ err, res ] = await addCaptcha(data);

    if (err) {
      this.setState({ loading: false });
      Alert.alert(err.message);
      return
    }
    
    this.setState({ loading: false, countdown: 60  }, ()=>{

      // 发送成功后倒计时
      let run = () =>{

        if (!this.state.isMount) return;

        if (this.state.countdown == 0) {
          this.setState({ loading: false })
          return
        }
        this.setState({ countdown: this.state.countdown - 1 })
        setTimeout(()=>{ run() }, 1000)
      }

      run();

    });


  }

  render() {

    const self = this;
    const { countdown } = this.state;

    return (<TouchableOpacity onPress={()=>{ self.props.onClick(self.send); }}>
            <View style={styles.captchaButton}>
              <Text style={styles.text}>
                {countdown > 0 ? `发送成功 (${countdown})` : "获取验证码"}
              </Text>
            </View>
          </TouchableOpacity>)
  }
}


const styles = StyleSheet.create({
  captchaButton:{
    height:30,
    width:100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#dfe7ff'
  },
  text: {
    color:'#597fec',
    fontSize: 15,
    fontWeight: 'bold'
  }
})


export default connect((state, props) => {
    return {
    }
  },
  (dispatch) => ({
    addCaptcha: bindActionCreators(addCaptcha, dispatch)
  })
)(CaptchaButton)
