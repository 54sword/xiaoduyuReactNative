import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { officialWebsite } from '../../../config'
import { WebView } from "react-native-webview";

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
        source={{uri: officialWebsite + '/agreement'}}
        javaScriptEnabled={true}
        startInLoadingState={true}
        // scalesPageToFit={true}
        // useWebKit={true}
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
