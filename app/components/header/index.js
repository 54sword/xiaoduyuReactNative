import React, { PureComponent } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

import { SafeAreaView } from 'react-navigation';

// actions
import navigationService from '../../navigators/service';

// components
import BackIcon from '../../components/ui/icon/back';

// styles
import styles from './style';

export default class Header extends PureComponent {
  
  static defaultProps = {
    headerStyle: {},
    left: (<TouchableOpacity onPress={()=>{ navigationService.goBack() }}>
      <View style={styles.back}><BackIcon /></View>
    </TouchableOpacity>),
    center: <View><Text>center</Text></View>,
    right: <View><Text>right</Text></View>
  }
  
  render() {

    const { left, center, right, footer, headerStyle } = this.props;

    return (
      <SafeAreaView style={[styles.header, headerStyle]}>
        <View style={styles.left}>{left}</View>
        <View style={styles.center}>{center}</View>
        <View style={styles.right}>{right}</View>
      </SafeAreaView>
    )

  }
}
