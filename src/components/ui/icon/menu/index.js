
import React, { PureComponent } from 'react'
import { Image, StyleSheet } from 'react-native'

class MenuIcon extends PureComponent {
  render() {
    return (<Image source={require('./images/menu.png')} style={styles.icon} />)
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24
  }
})

export default MenuIcon
