import { StyleSheet, PixelRatio, Dimensions, Platform } from 'react-native';
// import { ifIphoneX } from 'react-native-iphone-x-helper';

const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
  header: {
    flexDirection:'row',
    // height:43,
    // paddingTop: Platform.OS === 'android' ? 0 : 20,
    // height: Platform.OS === 'android' ? 45 : 63,
    alignItems:'center',
    justifyContent:'space-between',
    backgroundColor:'#fff',
    // ...ifIphoneX({
    //   paddingTop:35,
    //   height: 75
    // }),
    // marginLeft:15,
    // marginRight:15,
    borderBottomWidth:1/PixelRatio.get(),
    borderColor: '#e9edf0'
    // shadowOffset: {width: 0, height: 5},
    // shadowOpacity: 0.3,
    // shadowRadius: 5,
    // shadowColor: '#999',
  },
  back: {
    height: 43,
    justifyContent:'center',
    paddingLeft:15,
    padding:15,
    // minWidth: width*0.25,
    // maxWidth: width*0.25
  },
  center: {
    flex:1,
    height: 43,
    // minWidth: width*0.5,
    maxWidth: width*0.5,
  },
  left: {
    // minWidth: width*0.25,
    // maxWidth: width*0.25,
    // backgroundColor:'red'
  },
  right: {
    // flex:1,
    alignItems:'flex-end',
    // minWidth: width*0.25,
    // maxWidth: width*0.25,
  }
});
