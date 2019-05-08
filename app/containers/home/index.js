import React, { Component } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Alert, TouchableOpacity, PixelRatio, Platform } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { SafeAreaView } from 'react-navigation';

import AsyncStorage from '@react-native-community/async-storage';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getProfile } from '../../store/reducers/user';
import { getTopicId } from '../../store/reducers/website';
import { saveTopicId } from '../../store/actions/website';
import { getTipsById } from '../../store/reducers/tips';

// components
import PostsList from '../../components/posts/list';
import FeedList from '../../components/feed/list';
import TabBar from '../../components/tab-bar';
import Header from '../../components/header';

import Topics from './components/topics';

// styles
import styles from './styles';


@connect(
  (state, props) => ({
    me: getProfile(state),
    // 当前topic
    topicId: getTopicId(state),
    redPointTab: [
      getTipsById(state, 'home'),
      getTipsById(state, 'feed'),
      getTipsById(state, 'subscribe')
    ],
    unread: getTipsById(state, 'home') || getTipsById(state, 'feed') || getTipsById(state, 'subscribe') || getTipsById(state, 'excellent')
  }),
  dispatch => ({
    saveTopicId: bindActionCreators(saveTopicId, dispatch)
  })
)
export default class Home extends Component {

  static navigationOptions = ({navigation}) => {

    const { redPoint, tabBarOnPress = ()=>{}, tabBarVisible = true } = navigation.state.params || {};

    return {
      // header: null,
      headerTitle: '小度鱼',
      tabBarLabel: '交流',
      headerTitle: '交流',
      tabBarIcon: ({ tintColor, focused }) => (
        <View>
          <Image
            source={focused ? require('./images/home-active.png') : require('./images/home.png')}
            style={[styles.icon, {tintColor: tintColor}]}
            />
          {redPoint ? <View style={styles.redPoint}></View> : null}
        </View>
      ),
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        defaultHandler();
        tabBarOnPress();
      },
      tabBarVisible
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      tab: 0,
      postsListRef: null,
      topic: null,
      refList: [],
      ready: false
    }
    this.onChoose = this.onChoose.bind(this)
    
    if (!this.props.me) {
      this.props.navigation.setParams({
        tabBarVisible: false
      });
    }

  }

  async componentDidMount() {

    this.didFocusSubscription = this.props.navigation.addListener('didFocus', payload=>{
      this.state.focus = true;
    });

    this.didBlurSubscription = this.props.navigation.addListener('didBlur', payload=>{
      this.state.focus = false;
    });

    this.props.navigation.setParams({
      tabBarOnPress: () => {
        // 如果是在当前页面，按下tab nav 按钮，则刷新
        if (this.state.focus) {
          let list = this.state.refList[this.state.tab];
          list.props._onRefresh(true);
        }
      }
    });

    try {
      let topic = await AsyncStorage.getItem('topic');
      topic = JSON.parse(topic);
      this.setState({ topic });
      this.onChoose(topic);

      let tab = await AsyncStorage.getItem('tab');

      
      this.state.tab = tab ? parseInt(tab) : 0;
    } catch(e) {
    }

    this.setState({ ready: true })

  }

  componentWillMount() {
    if (this.didFocusSubscription) this.didFocusSubscription.remove();
    if (this.didBlurSubscription) this.didBlurSubscription.remove();
  }
  
  onChoose(topic) {
    this.state.topic = topic;
    this.props.saveTopicId(topic._id);
    AsyncStorage.setItem('topic', JSON.stringify(topic));
  }

  render() {

    if (!this.state.ready) {
      return null;
    }
    

    const { navigation, topicId } = this.props;
    const { topic } = this.state;

    let query = {
      sort_by:'sort_by_date:-1',
      deleted: false,
      weaken: false
    }

    switch (true) {
      case topicId == 'excellent':
        query.recommend = true;
        break;

      case topicId == 'subscribe':
        query.method = 'subscribe';
        query.sort_by = "last_comment_at:-1";
        break;

      default:
        if (topicId) query.topic_id = topicId;
    }
    
    let renderHeader = (<View>
      <Topics
        onChoose={this.onChoose}
        />
      {/* <NewTips topicId={topicId || 'home'} /> */}
    </View>)

  if (!this.props.me) {
    return (<View style={{flex:1}}>

    
    <Header
      left={<TouchableOpacity
        style={{ height:40, justifyContent:'center',alignItems:'center', paddingLeft:15, paddingRight:15}}
        onPress={()=>{
          navigation.navigate('Sign');
        }}
        >
        <Text style={{fontSize: 16}}>登录</Text>
      </TouchableOpacity>}
      center={<View style={{ height:40, justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontSize: 16, fontWeight:'bold'}}>
          小度鱼
        </Text>
      </View>}
      right={<TouchableOpacity
        style={{ height:40, justifyContent:'center',alignItems:'center', paddingLeft:15, paddingRight:15}}
        onPress={()=>{
          navigation.navigate('SignUp');
        }}
        >
        <Text style={{fontSize: 16}}>注册</Text>
      </TouchableOpacity>}
      />
    
    <View style={styles.container}>

    <PostsList
      tabLabel={topic && topic._id ? topic.name : '全部'}
      {...this.props}
      navigation={navigation}
      renderHeader={renderHeader}
      key={topicId || 'home'}
      name={topicId || 'home'}
      filters={{ query }}
      getRef={(e)=>{
        this.state.postsListRef = e;
      }}
      />

    </View>
    
    </View>)
  }

return (<SafeAreaView style={{flex:1}}>
  <ScrollableTabView
  style={styles.container}
  initialPage={this.state.tab}
  onChangeTab={e=>{
    this.state.tab = e.i;
    AsyncStorage.setItem('tab', e.i+'');
  }}
  renderTabBar={() => <TabBar
    onChoose={this.onChoose}
    onScroll={e=>{ this.updateAnimation = e }}
    leftContent={<TouchableOpacity
      style={{height: 43, justifyContent:'center',alignItems:'center',paddingLeft:15,paddingRight:15 }}
      onPress={()=>{
        navigation.navigate('Search');
      }}
      >
      <Image
        source={require('./images/search.png')}
        style={{width:25,height:25,tintColor:'#5e6472'}}
      />
    </TouchableOpacity>}
    rightContent={<TouchableOpacity
      style={{ height: 43, justifyContent:'center',alignItems:'center',paddingLeft:15,paddingRight:15}}
      onPress={()=>{
        navigation.navigate('WritePosts');
      }}
      >
      <Image
        source={require('./images/plus.png')}
        style={{width:25,height:25,tintColor:'#5e6472'}}
      />
    </TouchableOpacity>}
    // redPointTab={newPostsList.data && newPostsList.data.length ? redPointTab.concat([0]) : redPointTab}
    initialPage={this.state.tab}
  />}
  onScroll={e=>this.updateAnimation(e)}
  >

    <PostsList
      tabLabel={topic && topic._id ? topic.name : '全部'}
      {...this.props}
      navigation={navigation}
      renderHeader={renderHeader}
      key={topicId || 'home'}
      name={topicId || 'home'}
      filters={{ query }}
      getRef={(e)=>{
        this.state.refList[0] = e;
      }}
      />

    <FeedList
      tabLabel="关注"
      navigation={navigation}
      // renderHeader={renderHeader}
      id='feed'
      filters={{
        query: {
          preference: true,
          sort_by: "create_at:-1"
        }
      }}
      getRef={(e)=>{
        this.state.refList[1] = e;
      }}
      scrollLoad={true}
      showTips={true}
      />

    <PostsList
      tabLabel="收藏"
      {...this.props}
      navigation={navigation}
      // renderHeader={renderHeader}
      key={'subscribe'}
      name={'subscribe'}
      filters={{
        query:{
          deleted: false,
          weaken: false,
          method: 'subscribe',
          sort_by: "last_comment_at:-1"
        }
      }}
      getRef={(e)=>{
        this.state.refList[2] = e;
      }}
      />

    </ScrollableTabView>
  </SafeAreaView>)
  }
}
