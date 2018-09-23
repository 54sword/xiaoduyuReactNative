

import React, { PureComponent } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';



// redux
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';

// actions
import NavigationService from '../../actions/navigation-service';

// components
import BackIcon from '../../components/ui/icon/back';

// styles
import styles from './style';


// @connect(
//   (state, props) => {
//     return {
//     }
//   },
//   dispatch => ({
//   })
// )
export default class Header extends PureComponent {

  static defaultProps = {
    headerStyle: {},
    left: <View style={styles.back}><BackIcon /></View>,
    center: <View><Text>center</Text></View>,
    right: <View><Text>right</Text></View>,
    footer: null
  }

  render() {

    const { left, center, right, footer, headerStyle } = this.props;

    return (<View>
      <View style={[styles.header, headerStyle]}>
        <TouchableOpacity
          style={styles.right}
          onPress={()=>{
            NavigationService.goBack()
          }}
          >
          {left}
        </TouchableOpacity>
        <View style={styles.center}>{center}</View>
        <View style={styles.right}>{right}</View>
      </View>
      {footer}
    </View>)
  }
}
