
import React, { PureComponent } from 'react'
import { Text, View, StyleSheet } from 'react-native'

class nothing extends PureComponent {
  render() {

    const { content } = this.props

    let main = null

    if (content && typeof content === 'string') {
      main = <Text style={styles.nothingText}>{content}</Text>
    } else if (content) {
      main = content
    }

    return (<View style={styles.nothingView}>{main}</View>)
  }
}

const styles = StyleSheet.create({
  nothingView: {
    flex:1,
    padding:10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  nothingText: {
    color:'rgb(128, 128, 128)'
  }
})

export default nothing
