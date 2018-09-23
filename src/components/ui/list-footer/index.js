
import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import Loading from '../loading'

export default class ListFooter extends Component {

  render() {

    const { loading, more } = this.props

    return (
      <View style={styles.view}>
        {loading ? <Loading /> : null}
        {/*!more ? <Text style={styles.text}>没有更多了</Text> : null*/}
      </View>
    )
  }

}

const styles = StyleSheet.create({
  view: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 12,
    color: 'rgb(140, 140, 140)'
  }
})

// export default ListFooter
