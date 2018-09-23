import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';

// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProfile } from '../../../reducers/user';
import { updateUser, loadUserInfo } from '../../../actions/user';

// components
import { ListItem } from '../../../components/ui';

class ResetGender extends React.Component {

  static navigationOptions = {
    title: '性别'
  }

  constructor (props) {
    super(props)
    this.state = {
      submitting: false
    }
    this.submit = this.submit.bind(this);
  }

  async submit(gender) {

    const { updateUser, loadUserInfo, navigation } = this.props;
    const { submitting } = this.state;

    if (submitting) return;

    this.setState({ submitting: true })

    let [err, res] = await updateUser({
      gender: gender
    });

    this.setState({ submitting: true });

    if (err) {
      Alert.alert('', res.message);
      return;
    }

    await loadUserInfo({});
    navigation.goBack();

  }

  render() {

    const { me } = this.props
    const { submitting } = this.state

    return (<View style={{marginTop:10}}>
            <TouchableOpacity onPress={()=>{this.submit(1)}}><ListItem type={me.gender == 1 ? "hook" : "none"} name={"男"} /></TouchableOpacity>
            <TouchableOpacity onPress={()=>{this.submit(0)}}><ListItem type={me.gender == 0 ? "hook" : "none"} name={"女"} /></TouchableOpacity>
          </View>)
  }

}

const styles = StyleSheet.create({
});

export default connect(state => ({
    me: getProfile(state)
  }),
  (dispatch) => ({
    updateUser: bindActionCreators(updateUser, dispatch),
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch)
  })
)(ResetGender);
