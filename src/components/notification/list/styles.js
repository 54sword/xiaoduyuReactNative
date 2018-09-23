import { StyleSheet, PixelRatio } from 'react-native'

export default StyleSheet.create({
  item: {
    // marginTop: 8 
  },
  itemContent: { padding: 15, backgroundColor: '#fff' },
  commentContent:{ padding: 10, marginTop: 10, backgroundColor: '#efefef', borderRadius:5 },
  commentContentText: { lineHeight: 20, color:'#23232b', marginTop:5, backgroundColor:'#f6f6f6', padding:10, borderRadius:4 },
  nickname: { fontWeight: 'bold', marginRight: 10, color:'#23232b', fontSize:14 },
  head: {  flexDirection:'row', justifyContent:'space-between' },
  headLeft: { flexDirection:'row', alignItems:'center' },
  avatar: { width: 20, height: 20, borderRadius: 10, marginRight: 5, backgroundColor:'#efefef' },
  gray: { color:'#909090', fontSize: 14 },
  black: { color:'#23232b' },
  title: { lineHeight: 20, fontSize:14, marginTop:5 },
  replyView: {
    height: 30,
    borderTopWidth: 1/PixelRatio.get(),
    borderColor: '#d4d4d4',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  readAll: { color:'#08f' },
  createAt: { fontSize: 12, color:'#909090' }
})
