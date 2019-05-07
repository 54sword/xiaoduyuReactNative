import { StyleSheet, PixelRatio } from 'react-native'

export default StyleSheet.create({

  // topic
  topic: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding:15,
    paddingRight:0,
    marginBottom: 6,
    justifyContent:'space-between'
  },
  topicInfo: {
    flex:1,
    flexDirection:'row'
  },
  topicAvatar: {
    width:50,
    height:50,
    borderRadius: 6,
    marginRight:15
  },
  topicName: {
    fontWeight:'bold',
    marginBottom:5
  },

  // posts
  posts: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding:15,
    paddingRight:0,
    marginBottom: 6,
    justifyContent:'space-between'
  },
  postsTitle: {
    flex:1,
    paddingRight:10
  },

  // people
  people: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding:15,
    paddingRight:0,
    marginBottom: 6,
    justifyContent:'space-between',
    alignItems:'center'
  },
  peopleHead: {
    flexDirection:'row',
    flex:1
  },
  peopleAvatar: {
    width:50,
    height:50,
    borderRadius: 25,
    marginRight:15
  },
  peopleStatus: {
    flexDirection:'row'
  },
  peopleItem: {
    fontSize: 13,
    marginTop:5,
    color:'rgb(73, 73, 73)'
  },
  peopleNickname: {
    fontWeight:'bold'
  },
  peopleBrief: {
    marginTop:5,
    fontSize:13
  }

})
