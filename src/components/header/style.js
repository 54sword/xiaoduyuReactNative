

import { StyleSheet, PixelRatio, Dimensions, Platform } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';

const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
  header: {
    flexDirection:'row',
    paddingTop: Platform.OS === 'android' ? 0 : 20,
    height: Platform.OS === 'android' ? 45 : 65,
    alignItems:'center',
    justifyContent:'space-between',
    backgroundColor:'#fff',
    ...ifIphoneX({
      paddingTop:35,
      height: 75
    })
  },
  back: {
    height: 45,
    justifyContent:'center',
    paddingLeft:15,
    padding:15,
    minWidth: width*0.25,
    maxWidth: width*0.25
  },
  center: {
    flex:1,
    height: 45,
    minWidth: width*0.5,
    maxWidth: width*0.5,
  },
  left: {
    minWidth: width*0.25,
    maxWidth: width*0.25,
  },
  right: {
    flex:1,
    justifyContent:'center',
    alignItems:'flex-end',
    height: 45,
    minWidth: width*0.25,
    maxWidth: width*0.25,
  },
  line: {
    height:1/PixelRatio.get(),
    backgroundColor: '#333'
  }
});
