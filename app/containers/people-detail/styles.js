import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    padding:20
  },
  head: {
    paddingBottom:20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20
  },
  brief: {
    paddingLeft:15,
    paddingRight:15,
    paddingBottom:15,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  other: {
    flexDirection: 'row',
    marginBottom: 10
  },
  nickname: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  fans: {
    marginRight: 10
  }
})
