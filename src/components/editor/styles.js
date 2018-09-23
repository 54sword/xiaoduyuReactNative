import { StyleSheet, PixelRatio, Platform } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';

export default StyleSheet.create({
  container: {
    flex: 1
  },

  // 控制台
  control: {
    height:40,
    backgroundColor:'#fff',
    flexDirection:'row',
    borderTopWidth: 1/PixelRatio.get(),
    borderColor: '#d8d8d8',
    paddingLeft:5,
    paddingRight:5,
    justifyContent:'space-between'
  },
  controlItem: {
    height:40,
    width:40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  controlIcon: {
    height:25,
    width:25
  },
  controlLeft: {
    flexDirection: 'row'
  }
});
