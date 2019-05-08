import { StyleSheet, PixelRatio } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import Platform from 'Platform'

let tabWidth = 60;

export default StyleSheet.create({
  tabbar: {
    // marginLeft:15,
    // marginRight:15,
    justifyContent: 'space-between',
    height:43,
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderBottomWidth: 1/PixelRatio.get(),
    borderColor: '#e9edf0',
    ...ifIphoneX({
      height:44
      // marginTop:-15
    })
  },

  tabbarLeft: {},
  tabbarRight: {},
  tabbarCenter: {
    // flex:1,
    // backgroundColor:'#333'
    // flex:1,
    // justifyContent: 'center',
    // alignItems: 'center'
  },



  tabView: {
    flex: 1,
    flexDirection: 'row'
    // justifyContent: 'center'
  },
  tab: {
    flex:1,
    // borderBottomWidth: 3,
    // borderColor: '#fff',
    // width:80,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#efefef'
  },
  tabActive: {
    flex:1,
    // borderBottomWidth: 3,
    // borderColor: '#08f',
    // width:80,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#efefef'
  },
  // 下划线
  underline: {
    // flex:1,
    height:3,
    width:16,
    borderTopLeftRadius:2,
    borderTopRightRadius:2,
    backgroundColor: '#1177fa'
    // marginTop:-10
    // marginTop:-10
    // ...ifIphoneX({
    //   marginTop:-8
    // },{
    //   marginTop:-10
    // })
  },
  redPoint: {
    position:'absolute',
    marginTop:12,
    marginLeft:45,
    // marginTop:31,
    // marginLeft:28,
    width:6,
    height:6,
    backgroundColor: 'red',
    borderRadius: 3
  },

  selectArrow: {
    width:13,
    height:10
  }
})