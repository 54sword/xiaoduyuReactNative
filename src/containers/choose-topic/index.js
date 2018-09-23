import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, ScrollView, Button, TouchableOpacity, PixelRatio } from 'react-native'

import Dimensions from 'Dimensions';
const screenWidth = Dimensions.get('window').width;
import { ifIphoneX } from 'react-native-iphone-x-helper';

// redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import { loadTopicList } from '../../actions/topic'
// import { getTopicListByName } from '../../reducers/topic'
import { loadTopicList } from '../../actions/topic';
import { getTopicListByKey } from '../../reducers/topic';

// components
// import CloseButton from '../../components/ui/close-button';


@connect(
  (state, props) => ({
    topicList: getTopicListByKey(state, 'head'),
  }),
  dispatch => ({
    loadTopicList: bindActionCreators(loadTopicList, dispatch)
  })
)
export default class ChooseTopic extends React.Component {

  static navigationOptions = ({ navigation }) => {
    // const { params = {} } = navigation.state
    return {
      // header: null
      title: '选择一个讨论话题',

      headerLeft: (<TouchableOpacity style={{padding:13,paddingLeft:15}} onPress={()=>{ navigation.goBack() }}>
                    <Text style={{fontSize:15,fontWeight:'bold',color:'#666'}}>取消</Text>
                   </TouchableOpacity>),

      tabBarIcon: ({ tintColor }) => (<Image source={require('./images/plus.png')} style={{width:26, height:26}} />),

      headerStyle: {
        ...ifIphoneX({
          height: 40,
          paddingTop:20,
          backgroundColor: '#fff',
          borderBottomWidth: 1/PixelRatio.get()
        }, {
          backgroundColor: '#fff',
          borderBottomWidth: 1/PixelRatio.get()
        })
      },
      headerTintColor: '#484848',
      headerTitleStyle: {
        color: '#484848'
      }

    }
  }

  constructor (props) {
    super(props)
    // this.cancel = this.cancel.bind(this)
    this.choose = this.choose.bind(this)
  }

  async componentDidMount() {
    const { topicList, loadTopicList } = this.props
    if (topicList && topicList.data) {
    } else {

      await loadTopicList({
        id: 'head',
        filters: {
          variables: {
            type: "parent",
            recommend: true
          }
        }
      });

      // loadTopicList({ name: 'all-topic', filters: { per_page: 500 } })
    }
  }

  // componentDidMount() {
  //   this.props.navigation.setParams({
  //     cancel: this.cancel
  //   })
  // }

  // cancel() {
  //   const { navigation } = this.props
  //   navigation.goBack()
  // }

  choose(topic) {
    // const { navigate } = this.props.navigation
    const { onSelect } = this.props.navigation.state.params
    onSelect(topic);
    this.props.navigation.goBack();
    // navigate('WritePosts', { topic })
  }

  render() {

    const { topicList } = this.props;


    if (!topicList || !topicList.data) {
      return (<View></View>)
    }

    return (<View>

      <ScrollView style={styles.container}>

      {topicList.data.map(item=>{
        return (<View key={item._id} style={styles.group}>
                  <View><Text style={styles.title}>{item.name}</Text></View>
                  <View style={styles.itemContainer}>
                    {item.children && item.children.map(item=>{
                      return (<TouchableOpacity
                        style={styles.item}
                        key={item._id}
                        onPress={()=>{this.choose(item)}}>
                          <View><Image source={{ uri: 'https:'+item.avatar }} style={{ width:20, height:20, borderRadius:10, marginRight:5 }} /></View>
                          <View><Text style={styles.black}>{item.name}</Text></View>
                        </TouchableOpacity>)
                    })}
                  </View>
                </View>)
      })}
    </ScrollView>
    </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    padding:15,
    backgroundColor:'#fff'
  },
  slogan: {
    paddingTop:10,
    paddingBottom:30
  },
  sloganText: {
    fontSize:22,
    fontWeight: 'bold'
  },
  group: {
    marginBottom:30
  },
  itemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  item: {
    width: (screenWidth - 40)/ 3,
    marginTop:10,
    marginBottom:10,
    // paddingTop: 10,
    // paddingRight: 10,
    flexDirection:'row',
    alignItems:'center'
  },
  title: {
    color:'rgb(88, 88, 88)',
    fontSize:16,
    fontWeight:'bold',
    marginBottom:10
  },
  black: {
    color: '#23232b'
  }
});

/*
const stylesIcon = StyleSheet.create({
  icon: { width: 24, height: 24 },
  tabBarLabel: {
    marginTop:20,
    flex:1,
    width:'100%',
    // height:45,
    // flexDirection: 'row'
  },
  tabBarLabelView: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabBarLabelLine: {
    height:3,
    backgroundColor:'#fff'
  },
  focused: {
    backgroundColor:'#08f'
  },
  item: {
    flexDirection:'row'
  }
})
*/
/*
export default connect(state => ({
    topicList: getTopicListByName(state, 'all-topic')
  }),
  (dispatch) => ({
    loadTopicList: bindActionCreators(loadTopicList, dispatch)
  })
)(ChooseTopic);
*/
