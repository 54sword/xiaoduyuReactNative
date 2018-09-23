import { StyleSheet, PixelRatio } from 'react-native';

export default StyleSheet.create({
  container: {
    // backgroundColor:'#e6e8eb'
    flex:1,
    // marginTop:10,
    // backgroundColor:'#efefef'
  },
  avatarItem: {
    alignItems:'center',
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    marginBottom: 6
  },
  avatar: {
    width:80,
    height:80,
    borderRadius: 40,
    marginBottom:10,
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
