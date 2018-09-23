
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

  input: {
    // alignItems:'center',
    // marginTop:20,
    // fontSize:15,
    // borderWidth:1,
    // height:45,
    // paddingLeft:15,
    // borderColor:'#dbdbdb',
    // borderRadius:6

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

  selectItem: {
    paddingTop:10,
    paddingBottom:10,
    flexDirection:'row'
    // padding:10,
    // borderRadius:6
  },

  active: {
    color:'#597fec',
    fontWeight:'bold'
    // backgroundColor:'#d9f5da',
    // borderColor:'#a3d7a5',
    // borderWidth:1
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
  }


})
