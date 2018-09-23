

import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'

class Fieldset extends Component {

  constructor (props) {
    super(props)
  }

  render() {
    return (<View style={styles.line}>
        <Text style={styles.lineText}>{this.props.text}</Text>
      </View>)
  }
}


const styles = StyleSheet.create({
  line:{
    flex:1,
    borderColor: '#dce0e0',
    borderBottomWidth: 1,
    marginBottom: 20,
    marginTop: 20,
    alignItems: 'center'
  },
  lineText: {
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom:-7
  }
})

export default Fieldset
