import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  icon: { width: 21, height: 21 },
  tabbatRight: { flex:1, flexDirection:'row-reverse' },
  write: { width: 50, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection:'row',
    paddingTop:20,
    height: 55,
    backgroundColor:'#fff'
    // borderBottomWidth:1/PixelRatio.get(),
    // borderColor:'#efefef'
  },
  searchInput: {
    flex:1,
    margin:10,
    marginTop:5,
    // marginBottom:5,
    paddingLeft:10,
    backgroundColor:'rgb(236, 236, 236)',
    height:30,
    borderRadius:5,
    justifyContent:'center'
  },
  searchInputText: {
    color:'rgb(177, 175, 175)'
  },
  headButton: {
    justifyContent:'center',
    alignItems:'center',
    paddingLeft:20,
    paddingRight:20
  },
  headButtonText: {
    fontSize:14,
    fontWeight:'bold'
    // color:'#1054ff'
  },
  signBar: {
    height: 45,
    backgroundColor:'rgb(65, 104, 241)',
    justifyContent:'center',
    alignItems:'center'
  }
})
