import React, { Component } from 'react';
import PostsList from '../../components/posts-list'

import { View, Text, Image, StyleSheet } from 'react-native'

class mineFollow extends React.Component {

  static navigationOptions = {
    header: null,
    title: '关注',
    tabBarLabel: (props) => {
      return (<View style={stylesIcon.tabBarLabel}>
        <View style={stylesIcon.tabBarLabelView}><Text>关注</Text></View>
        <View style={[stylesIcon.tabBarLabelLine, props.focused ? stylesIcon.focused : null ]}></View>
        </View>)
    }
  }

  render() {

    const { navigation } = this.props

    return <PostsList
              {...this.props}
              tabLabel='话题'
              navigation={navigation}
              name="follow"
              filters={{
                weaken: 1,
                method: 'user_custom',
                // include_comments: 1,
                // comments_sort: 'like_count:-1,reply_count:-1',
                device: 'ios'
              }}
              />
  }
}

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
  }
})

export default mineFollow
