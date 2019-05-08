import { StyleSheet, PixelRatio } from 'react-native'

export default StyleSheet.create({

  item: {
    // margin:10,
    // marginTop:3,
    // marginBottom:3,
    // borderRadius:14,
    backgroundColor:'#fff',
    paddingBottom:15,
    // borderTopWidth:1,
    // borderColor:'#eaedf0'
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.05,
    // shadowRadius: 6
  },

  headbar: {
    padding:15,
    paddingBottom:10,
    // paddingLeft:55,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems: 'center'
  },

  head: {
    flex:1,
    padding:15,
    // paddingLeft:70,
    paddingRight:0,
    paddingBottom:0,
    marginBottom: 15
  },

  avatar: {
    // position:'absolute',
    // marginTop:-2,
    // marginLeft:-40,
    width:40,
    height:40,
    borderRadius: 20,
    marginRight: 10
    // marginTop:-5
  },

  create_at: {
    fontSize: 11,
    color:'#5e6472'
  },

  /*
  avatar: {
    position:'absolute',
    marginLeft:-55,
    width:45,
    height:45,
    borderRadius: 45/2,
    // marginTop:-5
  },
  */

  nickname: {
    lineHeight: 16,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom:3,
    color:'#000'
    // marginTop:5
  },

  headInfo: {
    // marginTop: 5,
    flexDirection: 'row'
  },

  topicName: {
    // backgroundColor:'#f0f3f6',
    // padding:5,
    // borderRadius: 4
  },

  topicNameText: {
    fontSize: 13,
    color:'#5c6064'
  },

  body: {
    padding:15,
    paddingTop:0,
    paddingBottom:0,
    flexDirection:'row'
  },

  images:{
    // flex: 1,
    width: 75,
    height: 75,
    marginLeft:10,
    // marginTop:10,
    // marginRight:10,
    // marginBottom:10,
    backgroundColor:'#efefef',
    borderRadius:6
  },

  title: {
    fontWeight: 'bold',
    fontSize: 17,
    color:'#000',
    lineHeight:22
  },

  contentSummary: {
    marginTop:2
  },

  contentText: {
    lineHeight:20,
    fontSize:14,
    color:'#000'
  },

  more: {
    borderTopWidth: 1,
    borderColor: '#efefef',
    padding:15,
    backgroundColor:'#fff'
  },

  footer: {
    marginTop:10,
    paddingLeft:15,
    paddingRight:15,
    flexDirection:'row',
    // justifyContent:'space-between'
  },

  footerText: {
    // marginRight:15,
    fontSize: 13,
    color: '#5c6064',
    lineHeight: 14
  },

  point: {
    marginTop:6,
    marginLeft:7,
    marginRight:7,
    width:2,
    height:2,
    borderRadius:1,
    backgroundColor:'#c1c3ce'
  }

})
