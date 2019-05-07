import { StyleSheet, PixelRatio } from 'react-native';

export default StyleSheet.create({
  left: {
    padding: 10,
    paddingLeft:50,
    minHeight: 50
  },
  leftAvatar: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: -40
  },

  right: {
    alignItems: 'flex-end',
    padding: 10,
    paddingLeft:50,
    minHeight: 50
  },
  
  rightAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft:10
  },

  content_html: {
    backgroundColor:'#efefef',
    padding:10,
    borderRadius:14
  },

  createAt: {
    paddingTop:10,
    paddingBottom:10,
    alignItems:'center'
  },

  createAtText: {
    color:'#cccccc',
    fontSize: 12
  }
})
