import { StyleSheet, PixelRatio } from 'react-native';

export default StyleSheet.create({
  container: {
    padding:20,
    flex:1
  },

  profile: {
    marginTop: 30,
    marginBottom: 30,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
    // alignItems:'center'
  },
  nickname: {
    fontSize: 24,
    fontWeight:'bold',
    marginBottom: 10
  },
  birf: {
    paddingLeft:30,
    paddingRight:30,
    marginTop: 15,
    marginBottom: 15,
    // paddingTop:15,
    paddingBottom:15,
    // borderTopWidth:1/PixelRatio.get(),
    // borderBottomWidth:1/PixelRatio.get(),
    borderColor:'#cdced2'
  },

  avatarItem: {
    alignItems:'center',
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    marginBottom: 6
  },
  avatar: {
    width:60,
    height:60,
    borderRadius: 30,
    // marginBottom:10,
    // marginRight:15,
    backgroundColor:'#efefef'
  },
  icon: { width: 21, height: 21 },
  itme: {
    height: 45,
    // alignItems:'center',
    justifyContent:'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#efefef',
    paddingLeft:20,
    paddingRight: 20
  },
  gap: {
    height: 6
    // backgroundColor:'#efefef'
  }
})
