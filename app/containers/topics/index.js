import React, { Component } from 'react'
import { StyleSheet, Text, View, ListView, Image } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ScrollableTabView from 'react-native-scrollable-tab-view'

import { loadTopicList, followTopic, unfollowTopic } from '../../store/actions/topic'
import { getTopicListByName } from '../../store/reducers/topic'

import TopicList from '../../components/topic-list'
import Loading from '../../components/ui/loading'
// import PostsList from '../../components/posts-list'

import TabBar from '../../components/tab-bar'

class Topic extends React.Component {

  static navigationOptions = {
    header: null,
    title: '话题',
    tabBarIcon: ({ tintColor }) => (
      <Image source={require('./images/topic.png')} style={[styles.icon, {tintColor: tintColor}]} />
    )
  }

  componentWillMount() {
    const { list } = this.props
    if (!list.data) {
      this.props.loadTopicList({
        name: 'index',
        filters: { child:-1, per_page:1000 }
      })
    }
  }

  render() {
    const self = this
    const { list } = this.props
    const { navigation } = this.props

    if (!list || !list.data || list.data.length == 0) {
      return (<Loading />)
    }

    return (<ScrollableTabView
      renderTabBar={() => <TabBar navigation={navigation} onScroll={(e)=>{ self.updateAnimation = e }} />}
      onScroll={(e)=>self.updateAnimation(e)}
      >

      <TopicList tabLabel={'全部'} name="all" filters={{ child:1, per_page:20 }} {...this.props} />

      {list.data.map(item=>{
        return (<TopicList
          key={item._id} tabLabel={item.name}
          name={item._id}
          filters={{ child:1, per_page:20, parent_id:item._id  }}
          {...this.props}
        />)
      })}

    </ScrollableTabView>)
  }
}

const styles = StyleSheet.create({
  icon: { width: 26, height: 26, marginTop:-5 },
  item: { marginTop:10 }
})

export default connect((state, props) => ({
    list: getTopicListByName(state, 'index')
  }),
  (dispatch) => ({
    loadTopicList: bindActionCreators(loadTopicList, dispatch)
  })
)(Topic)
