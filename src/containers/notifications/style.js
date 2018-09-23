import { StyleSheet, PixelRatio } from 'react-native';

export default StyleSheet.create({
  icon: { width: 21, height: 21 },
  subscript: {
    position:'absolute',
    zIndex:99,
    marginLeft:13,
    marginTop:5,
    backgroundColor: 'red',
    borderRadius: 15,
    paddingLeft:5,
    paddingRight:5,
    height:15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  subscriptText: {
    color: '#fff',
    fontSize:11
  },
  tabBarIcon:{
    flex:1,
    alignItems:'center',
    justifyContent: 'center'
  },
  tips: {
    position: 'absolute',
    zIndex:99,
    top:65,
    left:15,
    height: 30,
    width: global.screen.width - 30,
    backgroundColor: '#6476f8',
    justifyContent:'center',
    alignItems:'center',
    borderRadius: 5
  },
  tipsText: {
    color:'#fff'
  }
});
