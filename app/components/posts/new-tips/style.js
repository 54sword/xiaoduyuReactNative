import { StyleSheet, PixelRatio, Dimensions, Platform } from 'react-native';
// import { ifIphoneX } from 'react-native-iphone-x-helper';

// const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
  button: {
    marginLeft:10,
    marginRight:10,
    borderRadius:6,
    height: 35,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#c3d3fe',
    marginBottom:6,
    borderWidth:1/PixelRatio.get(),
    borderColor:'#81a4ff'
  }
});
