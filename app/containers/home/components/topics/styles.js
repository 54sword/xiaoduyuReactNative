import { StyleSheet, PixelRatio } from 'react-native'

export default StyleSheet.create({

  box: {
    // paddingLeft:10,
    // paddingRight:15,
    // margin:10,
    // marginBottom:10,
    // marginTop:10,
    // borderRadius:14,
    padding:5,
    paddingTop:10,
    paddingBottom:10,
    // margin:5,
    // marginBottom:0,
    // marginTop:15,
    // marginBottom:5,
    // paddingTop:15,
    // paddingBottom:5,
    // paddingTop:15,
    // paddingBottom:0,
    backgroundColor:'#fff',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.05,
    // shadowRadius: 6
    // borderTopWidth:1/PixelRatio.get(),
    // borderBottomWidth:1/PixelRatio.get(),
    // borderColor:'#cdced2'
    borderBottomWidth:6,
    borderColor:'#f8f8f8'
  },

  titleBar: {
    flexDirection:'row',
    alignItems:'center',
    // marginTop:5,
    marginBottom: 10,
    marginLeft:5,
    // paddingBottom: 15,
    justifyContent:'space-between',
    // borderBottomWidth:1/PixelRatio.get(),
    // borderColor:'#e0e1e7'
  },

  titleText: {
    fontWeight:'bold',
    color:'#1c1e25',
    fontSize: 16
  },

  moreButton: {
    // width:100,
    // marginTop:10,
    // backgroundColor:'#f0f3f6',
    paddingTop:10,
    paddingBottom:10,
    // borderRadius: 4,
    justifyContent:'center',
    alignItems:'center'
    // marginTop:5
    // marginLeft:5
  },
  
  more: {
    fontSize: 15,
    // fontWeight:'bold',
    color:'#1177fa',
    // textAlign:'center'
  },

  row: {
    flexDirection:'row',
    flexWrap: 'wrap'
  },

  item: {
    padding: 5,
    margin:5,
    marginRight:0,
    marginBottom:0,
    // marginRight: 5,
    // marginLeft: 5,
    // paddingLeft:5,
    // paddingRight:5,
    // backgroundColor:'#ecedf1',
    // borderRadius: 24,
    paddingLeft:6,
    paddingRight:6,
    // backgroundColor:'#1177fa',
    borderRadius: 24,
  },

  topicName: {
    lineHeight:15,
    // padding:5,
    fontSize: 14,
    // fontWeight:'bold',
    color:'#1e1f23'
  },

  active: {
    // paddingLeft:2,
    // paddingRight:2,
    backgroundColor:'#1177fa',
    // borderRadius: 24,
  },

  expand: {
    marginTop:10,
    marginLeft:5
  },

  unread: {
    alignItems:'flex-end',
  },

  unreadRedPoint: {
    position:'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor:'red'
  }

})
