import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  select: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#fff',
    padding:5,
    borderRadius:5
  },
  selectIcon: {
    width: 15,
    height: 20
  },
  selectText: {
    fontWeight: 'bold',
    color: '#484848'
  },

  modalView: {
    flex:1,
    borderRadius: 10,
    overflow: 'hidden'
  },

  header: {
    backgroundColor:'#rgb(245, 245, 245)',
    padding:15,
  },

  scrollView: {
    flex:1,
    backgroundColor:'#fff'
  },
  countryItemView: {
    height:45,
    paddingLeft:15,
    borderColor:'#efefef',
    borderBottomWidth:1,
    justifyContent:'center'
  },
  active: {
    color:'#rgb(0, 111, 241)'
    // backgroundColor:'#efefef'
  }
});
