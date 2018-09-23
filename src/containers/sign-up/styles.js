import { StyleSheet, PixelRatio, Platform } from 'react-native'

export default StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#fff',
    padding:30,
    paddingTop:10,
    // backgroundColor: 'transparent'
  },
  
  title: { marginBottom: 10, backgroundColor: 'transparent' },
  titleText: { color:'#333', fontSize:32, fontWeight:'bold' },

  buttonText: { color:'#139aef' },

  textInput: {
    // marginTop:15,
    // color: '#fff',
    marginBottom:10,
    borderBottomWidth:1/PixelRatio.get(),
    borderColor: '#cccccc',
    // paddingTop:15,
    // paddingBottom:15
    // padding:15,
    // paddingLeft:15,
    paddingTop:15,
    paddingBottom:15,
    fontSize: 16
    // borderRadius: 6,
    // backgroundColor: '#4c7bf5'
  },

  selectCountry: {
    // flex:1,
    marginTop:10,
    borderBottomWidth:1/PixelRatio.get(),
    borderColor: '#cccccc',
    height: Platform.OS === 'android' ? 49 : 40,
    paddingRight:5
    // alignItems:'center',
    // justifyContent: 'center',
    // backgroundColor: '#4c7bf5',
    // borderTopLeftRadius: 6,
    // borderBottomLeftRadius: 6,
    // paddingLeft:10
    // paddingRight:10
  },

  button: {
    marginTop:20,
    height:45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#fff',
    borderRadius: 23,
    backgroundColor:'#597fec'
  },
  buttonText: {
    color:'#fff',
    fontSize:16
  },

  protocol:{
    marginTop:10,
    marginBottom:30,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row'
  },
  protocolText: {
    fontSize:14,
    color:'#484848',
    // marginRight:10,
    marginTop:10
  },

  tip:{
    marginBottom:15
  },
  tipText: {
    color:'#fff'
  }
})
