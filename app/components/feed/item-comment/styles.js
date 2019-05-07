import { StyleSheet, PixelRatio, Platform } from 'react-native';

export default StyleSheet.create({
  item: {
    // margin:10,
    // marginTop:5,
    // marginBottom:5,
    // borderRadius:14,
    paddingBottom:15,
    // flexDirection: 'row',
    backgroundColor: '#fff',
    // borderColor: '#e8e8e8',
    // borderTopWidth: 1/PixelRatio.get()
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.05,
    // shadowRadius: 6
  },

  main: {
    paddingLeft:15,
    paddingRight:15,
    // paddingBottom:20
    // marginTop: 5
  },
  head:{
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginBottom:10,
    paddingLeft:15,
    paddingTop:15
    // padding:15,
    // paddingBottom:0,
    // paddingRight:0
  },
  avatar:{
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight:10,
    marginTop: Platform.OS === 'android' ? 0 : -2
  },
  nicknameView: {
    // flexDirection: 'row'
  },
  create_at: {
    fontSize: 11,
    color:'#5e6472'
  },
  headLeft: {
    flexDirection: 'row'
  },
  nickname: {
    fontSize:14,
    fontWeight: 'bold',
    marginBottom:3
    // color:'#23232b'
    // marginRight: 10
  },
  other: {
    color: 'rgb(138, 138, 138)',
    fontSize: 12
  },
  headRight: {
    flexDirection: 'row'
  },
  like: {
    marginRight:15
  },

  content: {
    flex:1,
    // paddingRight: 15
  },

  contentText: {
    lineHeight:20,
    fontSize:15,
    color:'#000'
  },

  actions: {
    flexDirection: 'row',
    marginTop:10,
    paddingLeft:15,
    paddingBottom:15,
    justifyContent:'space-between'
    // padding:15,
    // paddingTop:0
  },

  action: {
    marginRight:10
  },

  subitem: {
    paddingLeft: 0
  },

  posts: {

    // justifyContent:'end-left-end',
    // minHeight: 50,
    // margin:10,
    // marginLeft:40,
    marginTop:15,
    marginBottom:5,
    padding:10,
    // borderLeftWidth: 3,
    // borderColor:'#cdced2',
    // borderWidth:1/PixelRatio.get(),
    backgroundColor:'#eaedf0',
    borderRadius: 8,
    flexDirection:'row',
    alignItems:'center'

  },

  postsAuthor: {
    fontSize: 14,
    // fontWeight:'bold',
    marginBottom: 5
  },

  postsTitle: {
    // marginTop:5,
    fontSize: 14,
    // fontWeight: 'bold',
    lineHeight: 18
  },
  postsSummary: {
    fontSize: 15,
    lineHeight: 20
  },


  contentSummary: {
    fontSize: 15,
    lineHeight: 20,
    color:'#000'
  },

  footerText: {
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
