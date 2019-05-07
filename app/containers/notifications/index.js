import React, { Component } from 'react';
import { Image, View, Text, TouchableOpacity } from 'react-native';

import { SafeAreaView } from 'react-navigation';

// styles
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProfile } from '../../store/reducers/user';
import { getUnreadNotice } from '../../store/reducers/website';
import { loadNewNotifications } from '../../store/actions/notification';
import { getNotificationListById } from '../../store/reducers/notification';

// components
import NotificationList from '../../components/notification/list';
import Header from '../../components/header'

// styles
import styles from './style';

@connect(
  (state, props) => ({
    me: getProfile(state),
    unreadNotice: getUnreadNotice(state),
    list: getNotificationListById(state, 'index')
  }),
  dispatch => ({
    loadNewNotifications: bindActionCreators(loadNewNotifications, dispatch)
  })
)
export default class Notifications extends React.Component {

  static navigationOptions = ({ navigation }) => {

    const { params = {} } = navigation.state
    const { redPoint = 0, tabBarOnPress = ()=>{}, } = params;

    return {
      title: '通知',
      tabBarLabel: '通知',
      tabBarIcon: ({ tintColor, focused }) => (
        <View>
          <View style={styles.tabBarIcon}>
            <Image
              source={focused ? require('./images/notification-active.png') : require('./images/notification.png')}
              style={[styles.icon, {tintColor: tintColor}]}
              />
          </View>
          {redPoint > 0 ?
            <View style={styles.subscript}><Text style={styles.subscriptText}>{redPoint > 99 ? 99 : redPoint}</Text></View>
            : null}
      </View>),
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        if (global.signInStatus) {
          if (params.load) params.load();
          defaultHandler();
          tabBarOnPress();
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

    const { me } = this.props;

    let baseQuery = {
      addressee_id: me._id,
      sort_by: 'create_at' 
    }

    this.state = {
      // 当前tab
      currentTab: 0,
      // 所有tab
      tabs: [
        { id: 'unread', name:'未读', query: { ...baseQuery, has_read: false } },
        { id: 'all', name:'全部', query: baseQuery },
        { id: 'comment', name:'评论', query: { ...baseQuery, type: 'comment' } },
        { id: 'reply', name:'回复', query: { ...baseQuery, type: 'reply' } },
        { id: 'follow-people', name:'关注', query: { ...baseQuery, type: 'follow-you' } },
        { id: 'follow-posts', name:'收藏', query: { ...baseQuery, type: 'follow-posts' } },
        { id: 'like', name:'赞', query: { ...baseQuery, type: 'like-posts,like-comment,like-reply' } }
      ],
      listRef: null
    }
    this.load = this.load.bind(this);
    this.onTab = this.onTab.bind(this)
  }

  async load() {

    const { unreadNotice, loadNewNotifications, list } = this.props;

    // 点击开始加载未读消息
    if (unreadNotice.length > 0 && list && list.data && list.data.length > 0) {
      await loadNewNotifications({ name: 'all' });        
      if (this.list) {
        this.list.scrollToIndex({ viewPosition: 1, index: 0 });
      }
    }

  }

  componentDidMount() {

    this.didFocusSubscription = this.props.navigation.addListener('didFocus', payload=>{
      this.state.focus = true;
    });

    this.didBlurSubscription = this.props.navigation.addListener('didBlur', payload=>{
      this.state.focus = false;
    });

    const { unreadNotice } = this.props;

    this.props.navigation.setParams({
      unreadNotice,
      loadNewNotifications,
      load: this.load,
      tabBarOnPress: () => {
        // 如果是在当前页面，按下tab nav 按钮，则刷新
        if (this.state.focus && this.state.listRef) {
          this.state.listRef.props._onRefresh(true);
        }
      }
    });

  }

  componentWillMount() {
    if (this.didFocusSubscription) this.didFocusSubscription.remove();
    if (this.didBlurSubscription) this.didBlurSubscription.remove();
  }

  onTab(index) {
    return () => {
      this.setState({ currentTab: index })
    }
  }

  render() {

    const { me, unreadNotice, loadNewNotifications } = this.props;
    const { currentTab, tabs } = this.state;

    let tab = tabs[currentTab];

    if (!me) return null;

    return (
      <SafeAreaView style={styles.container} >

      <Header
        left={<Text></Text>}
        center={
          <View style={{ height:40, justifyContent:'center',alignItems:'center'}}>
            <Text style={{fontSize: 16, fontWeight:'bold'}}>通知</Text>
          </View>
        }
        right={<Text></Text>}
        />

      <View style={styles.listContainer}>

        <NotificationList
          {...this.props}
          renderHeader={<View>
            <View style={styles.tabs}>
              {tabs.map((item, index)=>{
                return (<TouchableOpacity
                  key={index}
                  style={currentTab == index ? styles.tabItemActive : styles.tabItem}
                  onPress={this.onTab(index)}
                  >
                  <Text
                    style={currentTab == index ? styles.tabItemActiveText : null}>
                    {item.name}
                  </Text>
                </TouchableOpacity>)
              })}
            </View>

            {(()=>{
          
              if (currentTab) return;
              
              if (unreadNotice.length > 0) {
                return (<TouchableOpacity
                style={styles.tips}
                onPress={()=>{
                  loadNewNotifications({ name: tab.id });  
                }}>
                  <Text>你有 {unreadNotice.length} 未读通知</Text>
                </TouchableOpacity>)
              }

            })()}

          </View>}
          name={tab.id}
          key={tab.id}
          filters={{
            query: tab.query
          }}
          collapsible={true}
          getRef={(list)=>{
            this.state.listRef = list;
          }}
          />

        </View>


      </SafeAreaView>)
  }

}
