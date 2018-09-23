import { Image, StyleSheet } from 'react-native';

export default StyleSheet.create({
  icon: { width: 21, height: 21 },
  tabbatRight: { flex:1, flexDirection:'row-reverse' },
  write: { width: 50, justifyContent: 'center', alignItems: 'center' },
  redPoint: {
    position:'absolute',
    zIndex:99,
    marginLeft:15,
    marginTop:2,
    backgroundColor: 'red',
    borderRadius: 4,
    width:8,
    height:8
  }
})
