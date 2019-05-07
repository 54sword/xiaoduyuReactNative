

import { StyleSheet, PixelRatio, Platform } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';

export default StyleSheet.create({
  centerContainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  posts: {
    padding:15
    // borderBottomWidth: 1,
    // borderColor: '#efefef'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  main: {
    flex: 2
  },
  topicItem: {
    backgroundColor: '#fff',
    padding:20,
    borderBottomWidth: 1,
    borderColor: '#efefef'
  },
  itemHead: {
    padding:15,
    paddingRight:15,
    flexDirection: 'row',
    borderBottomWidth: 1/PixelRatio.get(),
    borderColor: '#e8e8e8',
  },
  avatar: {
    width:35,
    height:35,
    borderRadius: 35/2,
    marginRight:10,
    marginTop: Platform.OS === 'android' ? 0 : -1
  },
  itemMain: {
    // marginTop:10
  },
  bottomBar: {
    height: 50,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#efefef',
    flexDirection: 'row'
  },
  comment: {
    width: 50,
    height: 50,
    lineHeight: 50,
    textAlign: 'center'
  },
  like: {
    width: 50,
    height: 50,
    lineHeight: 50,
    textAlign: 'center'
  },
  follow: {
    flex: 1,
    height: 50,
    lineHeight: 50,
    textAlign: 'center'
  },

  titleView: {
    padding:15,
    paddingTop:0,
    paddingBottom:0
    // alignItems:'center',
    // justifyContent:'center'
    // borderBottomWidth: 1,
    // borderColor: '#efefef',
  },

  titleText: {
    fontSize:24,
    fontWeight: 'bold',
    lineHeight: 32,
    color:'#292524'
  },

  headerRight: {
    flexDirection: 'row'
  },

  headerAction: {
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'red'
  },

  topicButton: {
    backgroundColor:'#efefef',
    paddingRight:10,
    paddingLeft:10,
    paddingTop:5,
    paddingBottom:5,
    borderRadius:40
  },

  bottomBar: {
    height:45,
    paddingLeft:15,
    borderTopWidth:1/PixelRatio.get(),
    borderColor:'#e8e8e8',
    backgroundColor:'#fff',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    ...ifIphoneX({
      height: 60,
      paddingBottom:15
    })
  }

});
