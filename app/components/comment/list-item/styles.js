import { StyleSheet, PixelRatio, Platform } from 'react-native';

export default StyleSheet.create({
  item: {
    // flexDirection: 'row',
    // backgroundColor: '#efefef',
    borderColor: '#e8e8e8',
    borderTopWidth: 1/PixelRatio.get()
  },

  main: {
    paddingLeft:15,
    paddingRight:15,
    paddingBottom:20,
    flexWrap:'wrap'
    // marginTop: 5
  },
  head:{
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginBottom:10,
    paddingLeft:15,
    paddingTop:20
    // padding:15,
    // paddingBottom:0,
    // paddingRight:0
  },
  avatar:{
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight:10,
    marginTop: Platform.OS === 'android' ? 0 : -2
  },
  nicknameView: {
    flexDirection: 'row'
  },
  headLeft: {
    flexDirection: 'row'
  },
  nickname: {
    fontSize:13,
    fontWeight: 'bold',
    color:'#23232b'
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
    lineHeight: 20,
    fontSize: 14
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
  }

})
