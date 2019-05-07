import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#fff'
  },

  header: {
    paddingTop:20,
    flexDirection:'row'
  },

  title: {
    justifyContent: 'center',
    borderColor: '#efefef',
    borderBottomWidth: 1,
    paddingLeft: 15,
    fontSize:15,
    height:45,
    backgroundColor: '#fff',
    fontSize: 17,
    fontWeight:'bold'
  },
  button: {
    height: 45,
    paddingLeft:15,
    paddingRight:15,
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'row'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3a63df'
  },
  inactiveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c9c9c9'
  }
})
