
import React, { PureComponent } from 'react'
import { Image, StyleSheet } from 'react-native'

class WriteIcon extends PureComponent {
  render() {
    return (<Image source={require('./images/write.png')} style={styles.icon} />)
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24
  }
})

export default WriteIcon
