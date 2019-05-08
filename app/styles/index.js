import { StyleSheet, PixelRatio } from 'react-native'

let style = {
  button:{
    backgroundColor:'#139aef',
    height:50,
    borderRadius:4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fullButton: {
    // flex:1,
    backgroundColor:'#139aef',
    height:45,
    borderRadius:4,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 20,
    // marginLeft: 20,
    // marginRight: 20
  },

  lightBlueButton: {
    backgroundColor:'#55bdff',
    height:45,
    borderRadius:4,
    justifyContent: 'center',
    alignItems: 'center'
  },

  borderButton: {
    backgroundColor:'#fff',
    height:45,
    borderRadius:4,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 20,
    // marginLeft: 20,
    // marginRight: 20,
    borderWidth:1,
    borderColor: '#0f98d8'
  },
  whiteButton: {
    height:50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    height: 50,
    fontSize: 14,
    borderBottomWidth:1,
    borderColor: '#dce0e0'
  },

  item: {
    paddingLeft:15,
    paddingRight:15,
    backgroundColor: '#fff'
  },
  rowItem: {
    flexDirection: 'row',
    paddingLeft:15,
    paddingRight:15,
    backgroundColor: '#fff'
  },
  // 标题栏样式
  headerStyle: {
    backgroundColor: '#fff'
  },
  loading: {
    height:50,
    justifyContent: 'center',
    alignItems: 'center'
  },


  // 圆角input
  radiusInput: {
    height: 45,
    borderColor: '#bfbfbf',
    borderWidth: 1/PixelRatio.get(),
    paddingLeft: 10,
    borderRadius: 5,
    justifyContent: 'center',
    backgroundColor:'#fff'
  },
  radiusInputTop: {
    height: 45,
    borderColor: '#bfbfbf',
    borderWidth: 1/PixelRatio.get(),
    paddingLeft: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    justifyContent: 'center',
    backgroundColor:'#fff'
  },
  radiusInputCenter: {
    height: 45,
    borderColor: '#bfbfbf',
    borderWidth: 1/PixelRatio.get(),
    paddingLeft: 10,
    marginTop:-1,
    justifyContent: 'center',
    backgroundColor:'#fff'
  },
  radiusInputBottom: {
    height: 45,
    borderColor: '#bfbfbf',
    borderWidth: 1/PixelRatio.get(),
    paddingLeft: 10,
    marginTop:-1,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: 'center',
    backgroundColor:'#fff'
  },

  radiusInputLeft: {
    height: 45,
    borderColor: '#bfbfbf',
    borderWidth: 1/PixelRatio.get(),
    paddingLeft: 10,
    marginTop:-1,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    justifyContent: 'center',
    backgroundColor:'#fff'
  },

  // margin
  m5: { margin:5 },
  mt5: { marginTop:5 },
  mr5: { marginRight:5 },
  mb5: { marginBottom:5 },
  ml5: { marginLeft:5 },
  m10: { margin:10 },
  mt10: { marginTop:10 },
  mr10: { marginRight:10 },
  mb10: { marginBottom:10 },
  ml10: { marginLeft:10 },
  m20: { margin:20 },
  mt20: { marginTop:20 },
  mr20: { marginRight:20 },
  mb20: { marginBottom:20 },
  ml20: { marginLeft:20 },

  // padding
  p10: { padding:10 },
  pt10: { paddingTop:10 },
  pr10: { paddingRight:10 },
  pb10: { paddingBottom:10 },
  pl10: { paddingLeft:10 },
  p20: { padding:20 },
  pt20: { paddingTop:20 },
  pr20: { paddingRight:20 },
  pb20: { paddingBottom:20 },
  pl20: { paddingLeft:20 },

  // color
  red: { color: 'rgb(232, 60, 60)' },
  yellow: { color: 'rgb(255, 132, 42)' },
  darkGray: { color: 'rgb(150, 150, 150)' },
  'dark-gray': { color: 'rgb(150, 150, 150)' },
  white: { color: '#fff' },


  // bg
  bgPrimary: {
    backgroundColor: '#337ab7',
    padding:10,
    borderRadius: 5
  },
  bgSuccess: {
    backgroundColor: '#dff0d8',
    padding:10,
    borderRadius: 5
  },
  bgInfo: {
    backgroundColor: '#d9edf7',
    padding:10,
    borderRadius: 5
  },
  bgWarning: {
    backgroundColor: '#fcf8e3',
    padding:10,
    borderRadius: 5
  },
  bgDange: {
    backgroundColor: '#f2dede',
    padding:10,
    borderRadius: 5
  },

  //
  bold: {
    fontWeight: 'bold',

  },

  // flexDirection
  'f-d-r': {
    flexDirection: 'row'
  },
  'f-d-r-r': {
    flexDirection: 'row-reverse'
  },
  'f-d-r-c': {
    flexDirection: 'column'
  },
  'f-d-r-r': {
    flexDirection: 'column-reverse'
  },

  // color
  blue: {
    color: '#08f'
  }

}

let make = (marks, params, values, modify) => {
  values.map(v=>{
    marks.map((m,k)=>{
      style[m+v] = {}
      style[m+v][params[k]] = modify ? modify(v) : v
    })
  })
}

make(['m-','m-t-','m-r-','m-b-','m-l-'], ['margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft'], [5,10,15,20,25,30])
make(['p-','p-t-','p-r-','p-b-','p-l-'], ['padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'], [5,10,15,20,25,30])
make(['f-s-'], ['fontSize'], [10,11,12,13,14,15,16,17,18,19,20,21,22,23,24])
make(['black-'], ['color'], [5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100], (value)=>'rgba(0, 0, 0, '+value/100+')')

export default StyleSheet.create(style)
