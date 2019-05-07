import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    flex:1
    // backgroundColor:'#eaedf0'
  },
  icon: { width: 21, height: 21 },
  expand: {
    backgroundColor:'#fff',
    paddingLeft:10,
    paddingBottom:10
  },
  redPoint: {
    position:'absolute',
    zIndex:99,
    marginLeft:15,
    marginTop:2,
    backgroundColor: 'red',
    borderRadius: 4,
    width:8,
    height:8
  },

  headIconButton: {
    height:40,
    paddingLeft:15,
    paddingRight:15,
    justifyContent:'center'
  },

  headIcon: {
    width:20,
    height:20,
    tintColor: '#8f919a'
  }

})
