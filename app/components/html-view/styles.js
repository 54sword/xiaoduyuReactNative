import { StyleSheet, PixelRatio } from 'react-native'

export default StyleSheet.create({

  content: {
    maxHeight: 100,
    overflow: 'hidden'
  },

  h2: {
    paddingBottom:15,
    marginTop:30,
    marginBottom:15,
    borderBottomWidth:1,
    borderColor:'#efefef'
  },

  h2Text: {
    fontSize: 18,
    fontWeight:'bold'
  },

  code: {
    marginTop:10,
    marginBottom:10,
    // padding:15,
    // paddingLeft:0,
    backgroundColor: '#222',
    flexDirection: 'row',
    // flexDirection: 'column'
    // backgroundColor: '#484848'
  },
  codeRow: {
      flex: 1,
      flexDirection: 'row',
      height: 25,
      alignItems: 'center'
  },

  codeWrapper: {
      flexDirection: 'column'
  },

  codeText: {
    color: '#a8ff60'
  },

  lineNumWrapper: {
      width: 40,
      height: 25,
      backgroundColor: 'rgb(59, 58, 58)',
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 10,
      //paddingTop: 20
  },

  lineNum: {
      // width: 50,
      color: 'rgba(255,255,255,0.5)',
  },

  codeLineWrapper: {
      height: 25,
      flexDirection: 'row',
      alignItems: 'center',
      // paddingLeft: 10,
      paddingRight: 20
  },

  notSupportVideo: {
    flex:1,
    backgroundColor: 'rgb(241, 241, 241)',
    alignItems: 'center',
    padding:10,
    marginTop:10,
    marginBottom:10
  },

  notSupportVideoText: {
    color: 'rgb(167, 167, 167)'
  },

  blockquote: {
    padding:10,
    backgroundColor: '#f4f4f4',
    borderLeftWidth: 5,
    borderColor:'#c6c6c6',
    marginTop:10,
    marginBottom:10
  }
})
