
import { StyleSheet, PixelRatio } from 'react-native';

export default StyleSheet.create({
  container: {
    flex:1,
    // backgroundColor: '#139aef',
    padding:30,
    paddingTop:10,
    // backgroundColor: 'transparent',
    backgroundColor:'#fff'
  },

  title: { marginBottom: 10, backgroundColor: 'transparent' },
  titleText: { color:'#333', fontSize:32, fontWeight:'bold' },

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

  error: {
    marginTop:15,
    marginBottom:15
  },

  errorText: {
    fontSize: 16,
    color: '#e23e3e'
  },

});
