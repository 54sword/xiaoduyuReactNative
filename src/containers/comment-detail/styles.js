import { StyleSheet, PixelRatio } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';

export default StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
  main: {
    flex: 1
  },
  comment: {
    padding:15
  },
  itemHead: {
    padding:15,
    paddingBottom:0,
    flexDirection: 'row'
  },
  head: {
    flexDirection: 'row'
  },
  avatar: {
    width:40,
    height:40,
    borderRadius: 20,
    marginRight:10
  },

  // 帖子标题
  postsTitle: {
    padding:15,
    paddingTop:5,
    borderColor: '#d4d4d4',
    borderBottomWidth: 1/PixelRatio.get()
  },
  postsTitleText: {
    fontSize: 16,
    fontWeight:'bold',
    lineHeight: 20
  },
  bottomBar: {
    height:45,
    paddingLeft:15,
    borderWidth:1/PixelRatio.get(),
    borderColor:'#d7d7d7',
    backgroundColor:'#fff',
    justifyContent:'center',
    ...ifIphoneX({
      height: 60,
      paddingBottom:15
    })
  }

});
