

import React, { Component } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'

export default class CloseButton extends Component {

  constructor (props) {
    super(props)
  }

  render() {
    return (<View style={styles.button}>
        <Image source={require('./images/close.png')} resizeMode="contain" style={{width:24,height:24}} />
      </View>)
  }
}


const styles = StyleSheet.create({
  button:{
    position: 'absolute',
    top: 30,
    left: 20
  }
})
