import { StyleSheet, PixelRatio } from 'react-native'

import Platform from 'Platform'

export default StyleSheet.create({

  postsItem: {
    backgroundColor:'#fff',
    // borderColor: '#cdcdcd',
    // borderTopWidth: 1/PixelRatio.get(),
    paddingBottom:15
    // marginTop:7
  },

  itemHead: {
    flex:1,
    flexDirection: 'row',
    padding:15,
    paddingRight:0,
    paddingBottom:0,
    marginBottom: 10
  },

  avatar: {
    width:35,
    height:35,
    borderRadius: 35/2,
    marginRight:10,
    marginTop: Platform.OS === 'android' ? 0 : -2
  },

  nickname: {
    fontWeight: 'bold',
    color:'#23232b'
  },

  itemHeadOther: {
    marginTop: 5,
    flexDirection: 'row'
  },

  itemHeadOtherItem: {
    fontSize: 12,
    color: '#858585',
    marginRight: 15
  },

  itemMain: {
    padding:15,
    paddingTop:0,
    paddingBottom:5,
    flexDirection:'row'
  },

  images:{
    // flex: 1,
    width: 80,
    height: 80,
    marginLeft:15,
    // marginTop:10,
    // marginRight:10,
    marginBottom:10,
    backgroundColor:'#efefef',
    borderRadius:4
  },

  flexContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },

  title: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom:5,
    color:'#23232b',
    lineHeight:22
  },

  loading: {
    height: 60
  },

  contentText: {
    lineHeight:20,
    fontSize:13,
    color:'#23232b'
  },

  more: {
    borderTopWidth: 1,
    borderColor: '#efefef',
    padding:15,
    backgroundColor:'#fff'
  },

  postsInfo: {
    flexDirection:'row',
    justifyContent:'space-between'
  }
})
