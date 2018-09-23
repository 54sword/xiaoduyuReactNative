import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  write: {
    marginTop:10,
    flex:1,
    height: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  writeButton: {
    fontSize: 16
  },

  topicContainer: {
    backgroundColor:'#fff',
    padding:15,
    flexDirection:'row',
    marginBottom: 6
  },

  avatar: {
    width:50,
    height: 50,
    marginRight: 15,
    borderRadius: 6
  },

  name: {
    fontWeight:'bold',
    fontSize: 16
  },

  headerRight: {
    flexDirection: 'row'
  }

});
