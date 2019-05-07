

import React, { Component } from 'react';
import {
  AppRegistry, StyleSheet, Text, View, Image, Button, ScrollView,
  TouchableOpacity, Alert, PixelRatio,
  Animated
} from 'react-native';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// styles
// import styles from './style';


@connect(
  (state, props) => {
    return {
    }
  },
  dispatch => ({
  })
)
export default class Header extends Component {

  static defaultProps = {
    left: <View><Text>left</Text></View>,
    center: <View><Text>center</Text></View>,
    right: <View><Text>right</Text></View>
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  render() {

    const { left, center, right } = this.props;
    
    return (<View style={{ flexDirection:'row', paddingTop:20, height:45,alignItems:'center' }}>
            <View>{left}</View>
            <View>{center}</View>
            <View>{right}</View>
          </View>)
  }
}
