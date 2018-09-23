import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, TextInput, Button, TouchableOpacity } from 'react-native';
// import { NavigationActions } from 'react-navigation'

// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateUser, loadUserInfo } from '../../../actions/user';
import { getProfile } from '../../../reducers/user';

// components
import HeadButton from '../../../components/ui/head-button';

// import gStyles from '../../styles'

class ResetNickname extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {
      title: '名字',
      headerRight: (<TouchableOpacity onPress={()=>params.submit()}>
        <HeadButton name="提交" />
      </TouchableOpacity>)
    }
  }

  constructor (props) {
    super(props)
    this.state = {}
    this.submit = this.submit.bind(this)
  }

  componentWillMount() {
    const { me } = this.props
    this.state.nickname = me.nickname
    this.props.navigation.setParams({
      submit: this.submit
    })
  }

  async submit() {

    const self = this
    const { me, updateUser, loadUserInfo, navigation } = this.props
    const { nickname } = this.state

    if (me.nickname == nickname) return navigation.goBack();
    if (!nickname) return Alert.alert('', '请输入您的名字');

    let [ err, result ] = await updateUser({
      nickname
    });

    if (err) {
      Alert.alert('', res.message);
      return;
    }

    await loadUserInfo({});

    navigation.goBack();
  }

  render() {

    const { me } = this.props

    return (<View style={styles.container}>
              <TextInput
                  style={styles.input}
                  autoCapitalize="none"
                  onChangeText={(nickname) => this.setState({nickname})}
                  placeholder='你的名字'
                  defaultValue={me.nickname}
                  autoFocus={true}
                  underlineColorAndroid='transparent'
                />
          </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop:10,
  },
  input: {
    padding:10,
    backgroundColor:'#fff'
  }
})

export default connect(state => ({
    me: getProfile(state)
  }),
  (dispatch) => ({
    updateUser: bindActionCreators(updateUser, dispatch),
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch)
  })
)(ResetNickname);
