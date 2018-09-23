import { StyleSheet } from 'react-native'

import Platform from 'Platform'

export default StyleSheet.create({
  item: {
    // marginTop: 10
    // borderBottomWidth: 1,
    // borderColor: '#e6e8eb'
  },
  container: {
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },

  nothing: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  topicItem: {
    backgroundColor:'#fff',
    marginBottom:8,


    // backgroundColor: '#333',
    // padding:15
    // borderBottomWidth: 8,
    // borderColor: '#efefef'
  },
  itemHead: {
    flexDirection: 'row',
    padding:15,
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
    color: '#aba8a6',
    marginRight: 10
  },
  itemMain: {
    padding:15,
    paddingTop:0
    // marginTop:10
  },
  images:{
    flex: 1,
    // width: 100,
    height: 200,
    // marginTop:10,
    // marginRight:10,
    marginBottom:10,
    backgroundColor:'#efefef'
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
    color:'#23232b'
  },
  more: {
    borderTopWidth: 1,
    borderColor: '#efefef',
    padding:15,
    backgroundColor:'#fff'
  }
})
