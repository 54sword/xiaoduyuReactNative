import React, { Component } from 'react'
import { StyleSheet, Text, View, ScrollView, Alert, Image, TouchableOpacity, AsyncStorage } from 'react-native'

// redux
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getProfile } from '../../reducers/user'

// components
import { ListItem } from '../../components/ui'

class Block extends React.Component {

  static navigationOptions = {
    title: '屏蔽设置'
  }

  constructor (props) {
    super(props)
  }

  render() {

    const { me } = this.props;
    const { navigate } = this.props.navigation;

    return (<ScrollView>
          <View style={{marginTop:6}}>

            <TouchableOpacity
              onPress={()=>{
                navigate('List', {
                  componentName: 'BlockList',
                  id: 'people',
                  filters: { people_id: 'exists' },
                  title: '不感兴趣的用户'
                })
              }}>
              <ListItem name={"不感兴趣的用户"} rightText={me.block_people_count || ''} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={()=>{
                navigate('List', {
                  componentName: 'BlockList',
                  id: 'posts',
                  filters: { posts_id: 'exists' },
                  title: '不感兴趣的帖子'
                })
              }}>
              <ListItem name={"不感兴趣的帖子"} rightText={me.block_posts_count || ''} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={()=>{
                navigate('List', {
                  componentName: 'BlockList',
                  id: 'comments',
                  filters: { comment_id: 'exists' },
                  title: '不感兴趣的评论'
                })
              }}>
              <ListItem name={"不感兴趣的评论"} rightText={me.block_comment_count || ''} />
            </TouchableOpacity>

          </View>
      </ScrollView>)
  }
}

const styles = StyleSheet.create({
})

export default connect(state => ({
    me: getProfile(state)
  }),
  (dispatch) => ({
  })
)(Block)
