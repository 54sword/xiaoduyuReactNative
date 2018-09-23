
import React, { PureComponent } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'

class Loading extends PureComponent {
  render() {
    return (<View style={styles.loading}>
      <ActivityIndicator animating={true} color={'#484848'} size={'small'} />
    </View>)
  }
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    padding:10,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default Loading
