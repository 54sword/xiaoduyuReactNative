import { StyleSheet, PixelRatio } from 'react-native';

export default StyleSheet.create({
  container: {
    flex:1,
    padding:20,
    paddingTop:0,
    paddingBottom:0,
    // backgroundColor:'#e6e8eb'
  },
  main: {
    marginTop: 10
  },
  avatarItem: {
    alignItems:'center',
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    marginBottom: 10
  },
  avatar: {
    width:20,
    height:20,
    backgroundColor: '#efefef'
  },
  icon: {
    width: 24,
    height: 24,
  },
  itme: {
    flexDirection: 'row',
    minHeight: 45,
    alignItems:'center',
    justifyContent: 'space-between',
    // justifyContent:'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#efefef',
    paddingLeft:20,
    paddingRight: 20
  },
  itemIcon: {
    width:20
  },
  arrowRight: {
    width:20,
    height:20,
  },
  gap: {
    height: 20
  },
  itmeCenter: {
    flexDirection: 'row',
    minHeight: 45,
    alignItems:'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#efefef',
    paddingLeft:20,
    paddingRight: 20
  }
})
