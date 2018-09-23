

import React, { Component } from 'react'
import { StyleSheet, View, WebView } from 'react-native'
import { official_website } from '../../../config'

class Agreement extends Component {

  static navigationOptions = ({navigation}) => ({
    headerTitle: '用户协议'
  })

  constructor (props) {
    super(props)
  }
  
  render() {

    return (<View style={styles.container}>
      <WebView
        ref={'webview'}
        automaticallyAdjustContentInsets={false}
        source={{uri: official_website + '/agreement'}}
        javaScriptEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
      />
    </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  }
})

export default Agreement
