import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, Image, TouchableOpacity, Platform, PixelRatio } from 'react-native';
// import Platform from 'Platform';
// import { StackActions, NavigationActions } from 'react-navigation';
// import JPushModule from 'jpush-react-native'
// import * as JPush from '../../common/jpush';

// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProfile } from '../../store/reducers/user';
// import { signOut } from '../../actions/sign'
// import { removeAccessToken } from '../../store/actions/user';
// import { getClientInstalled } from '../../store/reducers/client-installed';
// import { cleanAllData } from '../../store/actions/sign';

// components
import { ListItem } from '../../components/ui';
// import websocket from '../../common/websocket';

// styles
import styles from './style';

@connect(
  (state, props) => ({
    me: getProfile(state),
    // clientInstalled: getClientInstalled(state)
  }),
  dispatch => ({
    // removeAccessToken: bindActionCreators(removeAccessToken, dispatch),
    // cleanAllData: bindActionCreators(cleanAllData, dispatch)
  })
)
export default class Settings extends React.Component {

  static navigationOptions = {
    // header: null,
    title: '个人资料',
    // headerTransparent: true,
    // headerTintColor: '#484848'
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  render() {

    const { me } = this.props;
    const { navigate } = this.props.navigation;

    if (!me || !me._id) return (<View></View>);

    return (<ScrollView style={styles.container}>

            <TouchableOpacity onPress={()=>{ navigate('ResetAvatar', {}) }}>
              <ListItem
                name={"头像"}
                rightElement={<Image source={{uri:'https:'+me.avatar_url}} style={{width:50,height:50,margin:10,borderRadius:25}} />}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{ navigate('ResetNickname', {}) }}>
              <ListItem name={"名字"} rightText={me.nickname} />
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{ navigate('ResetGender', {}) }}>
              <ListItem name={"性别"} rightText={me.gender != null ? (me.gender == 1 ? '男' : '女') : ''} />
            </TouchableOpacity>

            {/* <TouchableOpacity onPress={()=>{ navigate('ResetBiref', {}) }}>
              <ListItem name={"个性签名"} rightText={me.brief} />
            </TouchableOpacity> */}

      </ScrollView>)
  }
}
