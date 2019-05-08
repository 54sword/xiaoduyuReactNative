import { StyleSheet, Platform } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';

export default StyleSheet.create({
  header: {
    flexDirection:'row',
    paddingTop: Platform.OS == 'ios' ? 20 : 0,
    backgroundColor:'#fff'
  },
  searchInput: {
    flex:1,
    margin:10,
    // marginTop:5,
    marginBottom:5,
    paddingLeft:10,
    margin:10,
    backgroundColor:'rgb(236, 236, 236)',
    height:35,
    borderRadius:5,
    justifyContent:'center',
    paddingVertical: 0,
    ...ifIphoneX({
      marginTop:25
    })
  },
  headButton: {
    justifyContent:'center',
    alignItems:'center',
    paddingLeft:10,
    paddingRight:20,
    height:35,
    ...ifIphoneX({
      marginTop:25
    },{
      marginTop:10
    })
  },
  headButtonText: {
    fontSize:15,
    fontWeight:'bold',
    color:'rgb(67, 98, 230)'
  },

  typeBar: {
    padding:10,
    paddingBottom:0,
    paddingTop:0,
    backgroundColor:'#fff',
    flexDirection:'row'
  },
  typeButton: {
    height: 35,
    paddingLeft:15,
    paddingRight:15,
    justifyContent:'center',
    alignItems:'center',
    borderBottomWidth:2,
    borderColor:'#fff'
  },
  activeTypeButton: {
    borderBottomWidth:2,
    borderColor:'#333'
  }

})
