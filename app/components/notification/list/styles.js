import { StyleSheet, PixelRatio } from 'react-native'

export default StyleSheet.create({
  item: {
    // margin:10,
    // marginTop:5,
    // marginBottom:5,
    // borderRadius:14,
    backgroundColor:'#fff',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.05,
    // shadowRadius: 6
    // marginTop: 8
  },
  itemContent: { padding: 15, paddingBottom:20, paddingTop:20 },
  commentContent:{ padding: 10, marginTop: 10, backgroundColor: '#efefef', borderRadius:5 },
  commentContentText: { lineHeight: 20, color:'#23232b', marginTop:10, backgroundColor:'#eaedf0', padding:10, borderRadius:8 },
  contentTrim:{ fontSize: 14, lineHeight: 20 },
  nickname: { fontWeight: 'bold', marginRight: 10, color:'#23232b', fontSize:14 },
  head: {  flexDirection:'row', justifyContent:'space-between' },
  headLeft: { flexDirection:'row', alignItems:'center' },
  avatar: { width: 20, height: 20, borderRadius: 10, marginRight: 5, backgroundColor:'#efefef' },
  gray: { color:'#909090', fontSize: 14 },
  black: { color:'#23232b', fontSize: 14 },
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
