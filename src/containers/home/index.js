import React, { Component } from 'react'
import { View, Text, ScrollView, Image, StyleSheet, Alert, TouchableOpacity, AsyncStorage, PixelRatio, Platform } from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view';
// import TabBar from "react-native-underline-tabbar";

import { ifIphoneX } from 'react-native-iphone-x-helper';

// import navigationService from '../../actions/navigation-service';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getProfile } from '../../reducers/user';
// import { cleanAllComment } from '../../actions/comment';
import { loadPostsList } from '../../actions/posts';
// showNewPosts
import { getPostsListByName } from '../../reducers/posts';
import { loadTopicList } from '../../actions/topic';
import { getTopicListByKey } from '../../reducers/topic';


// components
import PostsList from '../../components/posts/list'
import TabBar from '../../components/tab-bar'
import WriteIcon from '../../components/ui/icon/write'

// styles
import styles from './styles'

@connect(
  (state, props) => ({
    me: getProfile(state),
    newPostsList: getPostsListByName(state, 'new'),
    topicList: getTopicListByKey(state, 'head'),
  }),
  dispatch => ({
    loadPostsList: bindActionCreators(loadPostsList, dispatch),
    loadTopicList: bindActionCreators(loadTopicList, dispatch)
  })
)
export default class Home extends Component {

  static navigationOptions = ({navigation}) => {

    const { tabBarOnPress = ()=>{} } = navigation.state.params || {};

    return {
      headerTitle: '小度鱼',
      tabBarLabel: '谈论',
      headerTitle: '谈论',
      // header: null,
      // tabBarVisible: false,
      tabBarIcon: ({ tintColor }) => (<Image
        source={require('./images/home.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />),
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        defaultHandler();
        tabBarOnPress();
      }
      // tabBarVisible: typeof params.tabBarVisible != 'undefined' ? params.tabBarVisible : true
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      // listener: null,
      tab: 0,
      ready: false,
      redPointTab: [],
      topicList: [],
      postsLists: {},
      // 当前list
      currentTabPostsList: null,
      focus: false
      // showSign: false
    }
  }

  async componentDidMount() {


    const self = this;
    const { me, loadPostsList, loadTopicList, navigation } = this.props;
    const { redPointTab } = this.state;


    this.didFocusSubscription = this.props.navigation.addListener('didFocus', payload=>{
      this.state.focus = true;
    });

    this.didBlurSubscription = this.props.navigation.addListener('didBlur', payload=>{
      this.state.focus = false;
    });

    this.props.navigation.setParams({
      tabBarOnPress: () => {

        // 如果是在当前页面，按下tab nav 按钮，则刷新
        if (this.state.focus && this.state.postsLists[this.state.tab]) {
          let list = this.state.postsLists[this.state.tab];
          // list.props.refreshControl.props.onRefresh(true);
          // list.scrollToIndex({ viewPosition: 1, index: 0, animated: true });
          list.props._onRefresh(true);
          return;
        }

      }
    });


    // 加载话题
    let [ err, res ] = await loadTopicList({
      id: 'head',
      filters: {
        variables: {
          type: "parent",
          recommend: true
        }
      }
    });

    // console.log(err);
    // console.log(res);

    let topicListData = [];

    res.data.map(topic=>{

      let childrenIds = [];

      if (topic.children) {
        topic.children.map(item=>{
          childrenIds.push(item._id);
        });
      }

      childrenIds = childrenIds.join(',');

      topic.query = {
        sort_by: "sort_by_date",
        deleted: false,
        weaken: false,
        page_size: 10,
        topic_id: childrenIds
      }

      topicListData.push(topic);

    });

    topicListData.unshift({
      _id: 'discover',
      name:'发现',
      query: {
        sort_by: "sort_by_date",
        deleted: false,
        weaken: false
      }
    });

    const initTab = () => {

      AsyncStorage.getItem('tab', (errs, topicId)=>{

        let index = -1;

        if (topicId) {
          topicListData.map((topic, i)=>{
            if (topic._id == topicId) index = i;
          })
        }

        if (index == -1) index = 0;

        self.setState({ tab: index, ready: true, topicList: topicListData });

        // self.setState({ tab: result || 0, ready: true })

        /*
        if (result == 1) return

        loadPostsList({
          name: 'find_one_recent_posts',
          filters: { weaken: 1, method: 'user_custom', device: 'ios', per_page:1 },
          callback: (res) => {
            if (res && res.success && res.data && res.data[0]) {
              if (new Date(res.data[0].sort_by_date).getTime() > new Date(me.last_find_posts_at || 0).getTime()) {
                if (redPointTab.indexOf(1) == -1) {
                  redPointTab.push(1)
                }
              }
            }
          }
        })
        */

      })

    }

    if (Platform.OS === 'android') {
      setTimeout(initTab, 1000)
    } else {
      initTab()
    }

    // navigationService.setParamsByRouteKey({
    //   params: { redPoint: true },
    //   key: 'Follow',
    // })

  }

  componentWillMount() {
    if (this.didFocusSubscription) this.didFocusSubscription.remove();
    if (this.didBlurSubscription) this.didBlurSubscription.remove();
  }

  render() {

    const self = this;
    const { me, navigation, newPostsList, showNewPosts } = this.props;
    const { tab, ready, redPointTab, topicList } = this.state;

    if (!ready) return (<View></View>);

    return (<View style={{flex:1}}>

      {Platform.OS === 'ios' ? <View style={{height:20,backgroundColor:'#fff'}}></View> : null}

      {/*
      <View style={styles.header}>

        <TouchableOpacity
          style={styles.searchInput}
          onPress={()=>{
            navigation.navigate('Search');
          }}
          >
          <Text style={styles.searchInputText}>搜索社区内容</Text>
        </TouchableOpacity>
        <View style={styles.headButton}><Text style={styles.headButtonText}>搜索</Text></View>
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:16,fontWeight:'bold',color:'#333'}}>小度鱼</Text></View>
        <TouchableOpacity
          style={styles.headButton}
          onPress={()=>{
            navigation.navigate('ChooseTopic');
          }}
        >
          <Text style={styles.headButtonText}>发帖</Text>
        </TouchableOpacity>
      </View>
      */}

      <ScrollableTabView

      // initialPage={parseInt(tab)}
      onChangeTab={e=>{
        this.state.tab = e.i;
      }}
      renderTabBar={() => <TabBar
        onScroll={e=>{ this.updateAnimation = e }}
        rightContent={<TouchableOpacity
          style={{flex:1,justifyContent:'center',alignItems:'center',paddingLeft:15,paddingRight:15}}
          onPress={()=>{
            navigation.navigate('Search');
          }}
          >
          <Image
            source={require('./images/search.png')}
            style={{width:19,height:19,tintColor:'#81848b'}}
          />
        </TouchableOpacity>}
        // redPointTab={newPostsList.data && newPostsList.data.length ? redPointTab.concat([0]) : redPointTab}
        initialPage={parseInt(tab)}
      />}
      onScroll={e=>this.updateAnimation(e)}
      >

      {topicList.map((topic,index)=>{
        return (<PostsList
                {...this.props}
                navigation={navigation}
                // tabLabel={{label: topic.name}}
                tabLabel={topic.name}
                // label={topic.name}
                name={topic._id}
                key={topic._id}
                filters={{
                  query: topic.query
                }}
                getRef={(e)=>{
                  if (e) this.state.postsLists[index] = e;
                  // console.log('=======');
                  // console.log(e);
                }}
                />)
      })}

    </ScrollableTabView>

    </View>)
  }
}
