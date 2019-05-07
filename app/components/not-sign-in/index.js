
import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

export default class NotSignIn extends PureComponent {

  static defaultProps = {
    text: '您还没有登陆，无法显示通知内容',
    onPressSignUp: () => {},
    onPressSignIn: () => {}
  }

  render() {

    const { text, onPressSignUp, onPressSignIn } = this.props;

    return (<View style={styles.container}>
            <View style={styles.contentView}><Text>{text}</Text></View>
            <View>
              <TouchableOpacity style={styles.button} onPress={onPressSignUp}>
                <Text style={styles.buttonText}>注册</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity style={styles.button} onPress={onPressSignIn}>
                <Text style={styles.buttonText}>登陆</Text>
              </TouchableOpacity>
            </View>
          </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    // backgroundColor:'#333',
    justifyContent:'center',
    alignItems:'center'
  },
  button: {
    height:45,
    paddingLeft:40,
    paddingRight:40,
    // borderWidth:1,
    // borderColor:'#4170ea',
    borderRadius:40,
    marginTop:20,
    backgroundColor:'#4170ea'
  },
  buttonText: {
    lineHeight:45,
    color:'#fff'
  }
})
