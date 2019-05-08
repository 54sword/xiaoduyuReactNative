

import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, PixelRatio } from 'react-native'

class ListItem extends Component {

  constructor (props) {
    super(props)
  }

  render() {

    const { type, name, rightText, rightElement } = this.props

    if (type == 'center') {
      return (<View style={[styles.item, styles.center]}>
        <Text style={styles.black}>{name}</Text>
      </View>)
    }

    if (type == 'hook') {
      return (<View style={styles.item}>
        <View style={styles.minItem}><Text style={styles.black}>{name}</Text></View>
        <View style={styles.minItem}></View>
        <View style={styles.itemRight}>
          <Image source={require('./images/green-hook.png')} style={styles.arrowRight} />
        </View>
      </View>)
    }

    if (type == 'none') {
      return (<View style={styles.item}>
        <View style={styles.minItem}><Text style={styles.black}>{name}</Text></View>
        <View style={styles.minItem}></View>
      </View>)
    }

    return (<View style={[styles.item, (type == 'center' ? styles.center : null)]}>
      <View style={styles.minItem}>
        <Text style={styles.black}>{name}</Text>
      </View>
      <View style={styles.minItem}></View>
      <View style={styles.itemRight}>
        {rightElement}
        {rightText ? <Text style={styles.rightText}>{rightText}</Text> : null}
        <Image source={require('./images/arrow-right.png')} style={styles.arrowRight} />
      </View>
    </View>)
  }
}


const styles = StyleSheet.create({
  item:{
    // paddingLeft: 15,
    // paddingRight: 15,
    backgroundColor: '#fff',
    borderColor: '#d4d4d4',
    borderBottomWidth: 1/PixelRatio.get(),
    flexDirection: 'row',
    minHeight: 60,
    justifyContent:'space-between'
  },
  minItem: {
    // flex: 1,
    minHeight:45,
    justifyContent: 'center'
  },
  itemRight: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  arrowRight: {
    width:13,
    height:13
  },
  rightText: {
    fontSize: 16,
    marginRight: 10,
    color: '#rgb(176, 176, 176)'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  black: {
    fontSize: 17,
    color: '#23232b'
  }
})

export default ListItem
