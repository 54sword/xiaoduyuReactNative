import { StyleSheet, PixelRatio } from 'react-native';

export default StyleSheet.create({
  item: {
    flexDirection:'row',
    // borderBottomWidth:1/PixelRatio.get(),
    // borderColor:'#efefef',
    justifyContent:'space-between',
    minHeight: 70,
    paddingLeft:15,
    paddingRight: 15,
    paddingTop:10,
    paddingBottom:10,
    // margin:10,
    // marginTop:5,
    // marginBottom:5,
    // borderRadius:14,
    backgroundColor:'#fff',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.05,
    // shadowRadius: 6
  },
  itemLeft: {
    flex:1,
    paddingLeft:65,
    justifyContent:'center'
  },
  unreadCount: {
    position: 'absolute',
    backgroundColor:'red',
    paddingTop:1,
    paddingBottom:1,
    paddingLeft:5,
    paddingRight:5,
    marginLeft: -28,
    marginTop:-5,
    borderRadius: 20,
    height:17,

    // shadowColor: '#fff',
    // shadowOffset: { width: 0, height: 0 },
    // shadowOpacity: 1,
    // shadowRadius: 2,

    // borderColor:'#fff',
    // borderWidth:2
  },
  unreadCountText: {
    color:'#fff',
    fontWeight:'bold',
    fontSize: 12
  },
  unreadCountTextMore: {
    fontSize: 12,
    marginTop:-3,
    fontWeight:'bold',
    color:'#fff'
  },
  avatar:{
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: -65,
    marginTop:-8
  },
  nickname: {
    fontWeight:'bold'
  },
  lastMessage: {
    marginTop:5
  },
  lastMessageText: {
    color:'#666'
  },
  createAt: {
    fontSize: 13,
    color:'#999'
  }
})
