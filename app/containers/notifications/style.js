import { StyleSheet, PixelRatio } from 'react-native';

export default StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#fff'
  },

  listContainer: {
    flex:1
    // backgroundColor:'#eaedf0'
  },

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
    // width: global.screen.width - 30,
    backgroundColor: '#6476f8',
    justifyContent:'center',
    alignItems:'center',
    borderRadius: 5
  },
  tipsText: {
    color:'#fff'
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor:'#fff',
    // paddingTop:10,
    // paddingBottom:10,
    marginTop:10,
    marginLeft: 15,
    // margin:15,
    // marginTop:0,
    // marginBottom:10,
    // margin:10,
    // marginTop:10,
    // marginBottom:5,
    // padding:10,
    // borderBottomWidth:1/PixelRatio.get(),
    // borderColor:'#e0e1e7'
    // borderRadius: 14
  },
  tabItem: {
    padding:5,
    marginRight:10
  },
  tabItemActive: {
    padding:5,
    marginRight:10,
    backgroundColor:'#4170ea',
    borderRadius: 6
  },
  tabItemActiveText: {
    color:'#fff'
  },

  tips: {
    margin:10,
    marginTop:5,
    marginBottom:5,
    padding:10,
    borderRadius:6,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#c3d3fe',
    borderWidth:1/PixelRatio.get(),
    borderColor:'#81a4ff'
  }
});
