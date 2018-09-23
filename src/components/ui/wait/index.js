
import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, Modal } from 'react-native'

class Wait extends PureComponent {
  render() {

    const { text = '加载中...' } = this.props

    return (<Modal transparent={true} onRequestClose={()=>{}}>
            <View style={styles.loading}>
              <ActivityIndicator style={styles.animation} animating={true} color={'#fff'} size={'large'} />
              <Text style={styles.loadingText}>{text}</Text>
            </View>
          </Modal>)
  }
}

const styles = StyleSheet.create({
  loading: {
    flex:1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  animation: {
    marginBottom: 10
  },
  loadingText: {
    color: '#fff'
  },
})

export default Wait
