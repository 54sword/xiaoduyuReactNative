import React, { Component } from 'react'
import { StyleSheet, Text, View, Button, TextInput, Alert, TouchableOpacity } from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addComment, updateComment } from '../../actions/comment'

import Editor from '../../components/editor'
import Wait from '../../components/ui/wait'

class WriteComment extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    const { replyId, submit, allowPost = false } = params
    return {
      // header: null,
      // headerLeft: (<View><Button onPress={()=>params.cancel()} title={"取消"} /></View>),
      title: replyId ? '编写回复' : '编写评论',
      // headerRight: (<View><Button onPress={()=>params.submit()} title={"提交"} /></View>),
      headerRight: <TouchableOpacity style={styles.button} onPress={allowPost ? ()=>submit() : ()=>{}}>
                    <Text style={allowPost ? styles.buttonText : styles.inactiveButtonText}>提交</Text>
                   </TouchableOpacity>
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      contentJSON: '',
      contentHTML: ''
    }
    this.submit = this.submit.bind(this)
  }

  componentDidMount() {
    this.props.navigation.setParams({
      submit: this.submit
    })
  }

  submit() {

    const self = this
    const { postsId, parentId, replyId } = this.props.navigation.state.params
    const { addComment, updateComment, navigation } = this.props
    const { contentJSON, contentHTML } = this.state

    const { comment } = self.props.navigation.state.params

    if (contentJSON == '' || contentHTML == '') {
      Alert.alert('', '请输入内容')
      return
    }

    let data = {
      posts_id: postsId,
      device_id : 1,
      content : contentJSON,
      content_html: contentHTML
    }

    if (parentId) data.parent_id = parentId
    if (replyId) data.reply_id = replyId

    self.setState({ visible: true })

    if (comment) {
      // 更新
      updateComment({
        id: comment._id,
        contentJSON: contentJSON,
        contentHTML: contentHTML,
        callback: (res)=>{
          self.setState({ visible: false })
          if (res && res.success) {
            navigation.goBack()
          } else {
            setTimeout(()=>{
              Alert.alert('', res && res.error ? res.error : '更新失败')
            }, 2000)
          }
        }
      })
    } else {

      setTimeout(()=>{
        addComment({
          data,
          callback: (res) => {

            self.setState({ visible: false })

            if (res.success) {
              navigation.goBack()
            } else {
              setTimeout(()=>{
                Alert.alert('', res.error || '提交失败')
              }, 2000)
            }

          }
        })
      }, 1000)
    }


  }

  render() {

    const self = this
    const { comment } = self.props.navigation.state.params

    return (<View style={{flex:1}}>
      <Editor
        transportContent={(data)=>{
          self.state.contentJSON = data.json
          self.state.contentHTML = data.html
          self.props.navigation.setParams({
            allowPost: data.json ? true : false
          })
        }}
        initialContentJSON={comment ? comment.content : null}
      />
      {this.state.visible ? <Wait /> : null}
    </View>)
  }
}

const styles = StyleSheet.create({
  button: {
    height: 45,
    paddingLeft:20,
    paddingRight:20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#08f'
  },
  inactiveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c9c9c9'
  }
})

export default connect(state => ({
  }),
  (dispatch) => ({
    addComment: bindActionCreators(addComment, dispatch),
    updateComment: bindActionCreators(updateComment, dispatch)
  })
)(WriteComment)
