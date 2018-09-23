import React, { Component } from 'react';
import { Image, View, Text } from 'react-native';

// import Collapsible from 'react-native-collapsible-header';
import * as JPush from '../../common/jpush';

// styles
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProfile } from '../../reducers/user';
import { getUnreadNotice } from '../../reducers/website';
import { loadNewNotifications } from '../../actions/notification';
import { getNotificationByName } from '../../reducers/notification';

// components
import NotificationList from '../../components/notification/list';
import NotSignIn from '../../components/not-sign-in';

// styles
import styles from './style';

@connect(
  (state, props) => ({
    me: getProfile(state),
    unreadNotice: getUnreadNotice(state),
    list: getNotificationByName(state, 'index')
  }),
  dispatch => ({
    loadNewNotifications: bindActionCreators(loadNewNotifications, dispatch)
  })
)
export default class Notifications extends React.Component {

  static navigationOptions = ({ navigation }) => {

    const { params = {} } = navigation.state

    return {
      title: '通知',
      tabBarLabel: '通知',
      tabBarIcon: ({ tintColor }) => (
        <View>
          <View style={styles.tabBarIcon}><Image source={require('./images/notification.png')} style={[styles.icon, {tintColor: tintColor}]} /></View>
          {params.unreadNotice && params.unreadNotice.length > 0 ?
            <View style={styles.subscript}><Text style={styles.subscriptText}>{params.unreadNotice.length > 99 ? 99 : params.unreadNotice.length}</Text></View>
            : null}
      </View>),
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        if (global.signInStatus) {
          if (params.load) params.load();
          defaultHandler();
        } else {
          navigation.navigate('Sign', {
            routeName: 'Notifications'
            // onSignInFinish: ()=>{
            //   params.start();
            // }
          });
        }
      }
    }

  }

  constructor (props) {
    super(props);
    this.state = {
      ready: false
    }
    this.load = this.load.bind(this);
  }

  async load() {

    const { unreadNotice, loadNewNotifications, list } = this.props;

    // 点击开始加载未读消息
    if (unreadNotice.length > 0 && list && list.data && list.data.length > 0) {
      await loadNewNotifications({ name: 'index' });        
      if (this.list) {
        this.list.scrollToIndex({ viewPosition: 1, index: 0 });
      }
    }

    if (!this.state.ready) {
      this.setState({ ready: true });
    }

  }

  componentDidMount() {

    const self = this;
    const { unreadNotice } = this.props;

    this.props.navigation.setParams({
      unreadNotice,
      loadNewNotifications,
      load: this.load
    });

  }

  /*
  componentWillReceiveProps(props) {

    const { me } = this.props;

    if (!me) return;

    if (this.props.unreadNotice != props.unreadNotice) {

      const { update } = props.navigation.state.params || {};

      if (update) {
        console.log('触发了更新.....');
        this.start();
      }

      const self = this
      const { unreadNotice, loadNewNotifications } = props;

      JPush.setBadge(unreadNotice.length);

      this.props.navigation.setParams({
        unreadNotice,
        loadNewNotifications
      })
    }

  }
  */

  render() {

    const { me } = this.props;

    // if (!me) return <NotSignIn text="您还没有登陆，无法显示通知内容" />

    if (!me) return null;

    /*
    return (
      <Collapsible
        backgroundColor={'#fff'}
        renderHeader={<View style={{height:45, paddingLeft:10, marginBottom:10, justifyContent:'center', alignItems:'center', borderBottomWidth:1, borderColor:'#efefef' }}>
          <Text style={{fontSize:16, fontWeight:'bold', color:'#333'}}>通知</Text>
        </View>}
        // flatList={true}
        // renderContent is not needed if using FlatList
        renderContent={
          <NotificationList
            {...this.props}
            name="index"
            filters={{
              variables: {
                addressee_id: me._id,
                sort_by: 'create_at'
              }
            }}
            />
        }

        // flatList
        // data={Array(10).fill()}
        // keyExtractor={(item, i) => String(i)}
        // renderItem={({ index }) => <Content gray={index % 2 !== 0} />}
      />
    );
    */

    return (
      <View
      style={{
        // backgroundColor:'#e6e8eb',
        flex:1
      }}
      >

      {/*
      <View style={styles.tips}>
        <Text style={styles.tipsText}>您的关注发生了更新</Text>
      </View>
      */}

      <NotificationList
        {...this.props}
        /*
        renderHeader={<View style={{
          padding:15,
          // borderBottomWidth:1/PixelRatio.get(),
          // borderColor:'#efefef',
          backgroundColor:'#fff'
        }}>
          <Text style={{fontSize:24, fontWeight:'bold', color:'#23232b'}}>通知</Text>
        </View>}
        */
        headerBar={<View style={{flex:1,justifyContent:'center', alignItems:'center'}}><Text style={{fontSize:16, fontWeight:'bold', color:'#292524'}}>通知</Text></View>}
        name="index"
        filters={{
          variables: {
            addressee_id: me._id,
            sort_by: 'create_at'
          }
        }}
        collapsible={true}
        getRef={(list)=>{
          this.list = list;
        }}
        />
      </View>)
  }

}
