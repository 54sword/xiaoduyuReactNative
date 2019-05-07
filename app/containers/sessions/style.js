import { StyleSheet, PixelRatio } from 'react-native';

export default StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#fff'
  },
  avatarItem: {
    alignItems:'center',
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    marginBottom: 6
  },
  avatar: {
    width:80,
    height:80,
    borderRadius: 40,
    marginBottom:10,
    backgroundColor:'#efefef'
  },
  
  itme: {
    height: 45,
    // alignItems:'center',
    justifyContent:'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#efefef',
    paddingLeft:20,
    paddingRight: 20
  },
  gap: {
    height: 6
    // backgroundColor:'#efefef'
  },


  tabBarIcon:{
    flex:1,
    alignItems:'center',
    justifyContent: 'center'
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
    height:16,
    justifyContent: 'center',
    alignItems: 'center',
    // borderColor:'#fff',
    // borderWidth:4
  },
  subscriptText: {
    color: '#fff',
    fontWeight:'bold',
    fontSize:12
  },
  subscriptTextMore: {
    fontSize: 15,
    marginTop:-8,
    fontWeight:'bold',
    color:'#fff'
  }
})
