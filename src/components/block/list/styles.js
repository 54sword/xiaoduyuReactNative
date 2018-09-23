import { StyleSheet } from 'react-native'

export default StyleSheet.create({

  // posts
  postsView: {
    padding:10,
    backgroundColor:'#fff',
    borderBottomWidth: 1,
    borderColor: '#efefef',
    flexDirection: 'row',
    minHeight: 45,
    alignItems: 'center'
  },

  // comment
  commentView: {
    padding:10,
    backgroundColor:'#fff',
    borderBottomWidth: 1,
    borderColor: '#efefef',
    flexDirection: 'row',
    minHeight: 45
  },

  // people
  peopleView: {
    padding:10,
    backgroundColor:'#fff',
    borderBottomWidth: 1,
    borderColor: '#efefef',
    flexDirection: 'row'
  },
  avatar: {
    width:40,
    height:40,
    borderRadius: 20,
    marginRight:10
  }
})
