

import React, { Component } from 'react';
import {
  AppRegistry, StyleSheet, Text, View, Image, Button, ScrollView,
  WebView, TouchableOpacity, AsyncStorage, Alert, PixelRatio,
  Animated
} from 'react-native';

// package
// import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadPostsList, viewPostsById } from '../../actions/posts';
import { getPostsById } from '../../reducers/posts';
import { getProfile } from '../../reducers/user';

// components
import HTMLView from '../../components/html-view';
import Img from '../../components/image';
import CommentList from '../../components/comment/list';
// import Loading from '../../components/ui/loading';
import Nothing from '../../components/nothing';
import Wait from '../../components/ui/wait';
import LikeButton from '../../components/like-button';
import FollowButton from '../../components/follow/button';
import ReportMenu from '../../components/report-menu';
import ShareButton from '../../components/share-button';
import Header from '../../components/header';

// styles
import styles from './style';
const S = global.styles;;


@connect(
  (state, props) => {
    const id = props.navigation.state.params.id;
    return {
      posts: getPostsById(state, id),
      me: getProfile(state)
    }
  },
  dispatch => ({
    loadPostsList: bindActionCreators(loadPostsList, dispatch),
    viewPostsById: bindActionCreators(viewPostsById, dispatch)
  })
)
export default class PostsDetail extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      nothing: false,
      onScroll: Animated.event(
        [{ nativeEvent: { contentOffset: { y: this.scroll } } }],
        { useNativeDriver: true }
      )
    }
    this.toPeople = this.toPeople.bind(this);
  }

  scroll = new Animated.Value(0);

  headerOpacity = this.scroll.interpolate({
    inputRange: [45, 100],
    outputRange: [0, 1]
  });

  async componentDidMount() {

    /*
    this.state.onScroll = Animated.event(
      [{ nativeEvent: { contentOffset: { y: this.scroll } } }],
      {
        useNativeDriver: true,
        listener: (e) => {
          // console.log(e);
          // if (this._listRef) {
            // this._listRef.onScroll(e);
          // }
        }
      }
    );
    */

    const self = this
    const id = this.props.navigation.state.params.id;
    const { navigation } = this.props;
    let { loadPostsList, me, posts } = this.props

    let [ err, res ] = await loadPostsList({
      id,
      filters: {
        query: {
          _id: id
        }
      }
    });

    if (!res || !res.data[0]) return self.setState({ nothing: true });

    posts = res.data[0];


    // view + 1，逻辑
    // const id = this.props.navigation.state.params.id;
    const { viewPostsById } = this.props;

    AsyncStorage.getItem('view-posts', (errs, viewPosts)=>{
      if (!viewPosts) viewPosts = '';
    AsyncStorage.getItem('last-viewed-posts-at', (errs, lastViewPostsAt = new Date().getTime())=>{

      lastViewPostsAt = parseInt(lastViewPostsAt);

      // 如果超过1小时，那么浏览数据清零
      if (new Date().getTime() - lastViewPostsAt > 3600000) viewPosts = '';

      viewPosts = viewPosts.split(',');

      if (!viewPosts[0]) viewPosts = [];

      if (viewPosts.indexOf(id) != -1) return;

      viewPosts.push(id);
      AsyncStorage.setItem('view-posts', viewPosts.join(','), (errs, result)=>{});
      AsyncStorage.setItem('last-viewed-posts-at', new Date().getTime()+'', (errs, result)=>{});
      viewPostsById({ id: id });

    });
    });

  }

  // componentWillUnmount() {
    // Keyboard.dismiss();
  // }

  toPeople(user) {
    const { push } = this.props.navigation;
    push('PeopleDetail', { title: user.nickname, id: user._id })
  }

  render() {

    const { nothing } = this.state;
    const { me, posts, navigation } = this.props;
    const { navigate } = navigation;

    if (nothing) return (<Nothing content="帖子不存在或已删除" />);
    if (!posts) return <Wait />;

    let title = posts.title;

    if (title.length > 10) {
      title = title.slice(0, 10)+'...';
    }

    return (<View style={styles.container}>

      <Header
        footer={
          <Animated.View style={[{ height:1/PixelRatio.get(), backgroundColor: '#efefef' }, { opacity: this.headerOpacity }]}>
          </Animated.View>
        }
        center={
          <Animated.View style={[{ flex:1, justifyContent:'center', alignItems:'center' },{ opacity: this.headerOpacity }]}>
            <Text style={{fontWeight:'bold',fontSize:15,color:'#292524'}}>{title}</Text>
          </Animated.View>
        }
        right={
          <Animated.View style={[{ paddingRight:15 }, { opacity: this.headerOpacity }]}>
            <FollowButton
              posts={posts}
              onFinish={()=>{
                // this.componentWillMount();
              }}
              buttonType="max-gary"
              />
          </Animated.View>
        }
        />

        <View style={{flex:1}}>

              <CommentList
                {...this.props}
                getRef={(listref)=>{

                  // if (listref) {
                  //   console.log(listref.getNode());
                  // }


                  // if (listref) {
                    // this._listRef = listref.getNode();
                  // }


                  // console.log('-------');
                  // console.log(listref.getNode());
                }}
                name={posts._id}
                filters={{
                  query: {
                    posts_id: posts._id, parent_id: 'not-exists', page_size: 5
                  }
                }}
                displayLike={true}
                displayReply={true}
                displayCreateAt={true}
                renderHeader={()=>{
                  return(<View>
                              <View style={styles.titleView}><Text style={styles.titleText}>{posts.title}</Text></View>

                              <View style={styles.itemHead}>
                                <View>
                                  <TouchableOpacity onPress={()=>{this.toPeople(posts.user_id)}}>
                                    <Image source={{uri:'https:'+posts.user_id.avatar_url}} style={styles.avatar}  />
                                  </TouchableOpacity>
                                </View>
                                <View style={{flex:1}}>
                                  <Text onPress={()=>{this.toPeople(posts.user_id)}} style={[S['m-b-5'], S['bold'], S['f-s-12'], {color:'#292524'}]}>{posts.user_id.nickname}</Text>
                                  <View style={{ flexDirection: 'row' }}>
                                    <Text style={[S['m-r-10'], S['f-s-11'], { color:'#9a9a9a' } ]}>{posts._create_at}</Text>
                                    {/*posts.topic_id.name ? <Text style={[S['m-r-10'], S['f-s-12'], S['black-30'] ]}>{posts.topic_id.name}</Text> : null*/}
                                    {posts.view_count ? <Text style={[S['m-r-10'], S['f-s-11'], { color:'#9a9a9a' } ]}>{posts.view_count} 阅读</Text> : null}
                                    {posts.comment_count ? <Text style={[S['m-r-10'], S['f-s-11'], { color:'#9a9a9a' } ]}>{posts.comment_count} 评论</Text> : null}
                                    {/*posts.like_count ? <Text style={[S['m-r-10'], S['f-s-12'], S['black-30'] ]}>{posts.like_count} 赞同</Text> : null*/}
                                    {/*posts.follow_count ? <Text style={[S['m-r-10'], S['f-s-12'], S['black-30'] ]}>{posts.follow_count} 关注</Text> : null*/}
                                    {/*
                                    {posts.topic_id.name ? <Text style={[S['m-r-5'], S['f-s-12'], S['black-40'] ]}>{posts.topic_id.name}</Text> : null}
                                    {posts.view_count ? <Text style={[S['m-r-5'], S['f-s-12'], S['black-40'] ]}>{posts.view_count}次浏览</Text> : null}
                                    {posts.like_count ? <Text style={[S['m-r-5'], S['f-s-12'], S['black-40'] ]}>{posts.like_count}个赞</Text> : null}
                                    {posts.follow_count ? <Text style={[S['m-r-5'], S['f-s-12'], S['black-40'] ]}>{posts.follow_count}人关注</Text> : null}
                                    <Text style={[S['m-r-5'], S['f-s-12'], S['black-40'] ]}>{posts._create_at}</Text>
                                    */}
                                  </View>
                                </View>
                              </View>

                              {posts.content_html ?
                                <View style={styles.posts}>
                                  <View style={styles.itemMain}>
                                    <HTMLView html={posts.content_html} imgOffset={30} />
                                  </View>
                                </View>
                                : null}
                              </View>)
                }}
                onScroll={this.state.onScroll}
                // onScroll={(event)=>{
                  // console.log(event.nativeEvent.contentOffset.y);
                  // this.scroll = event.nativeEvent.contentOffset.y;
                // }}
                />

        </View>

        <TouchableOpacity
          onPress={()=>{
            if (me) {
              navigate('WriteComment', { posts_id: posts._id });
            } else {
              navigate('SignIn', {
                routeName: 'PostsDetail',
                setParams: {
                  title: posts.title,
                  id: posts._id
                },
                onSignInFinish: () => {
                  navigate('WriteComment', { posts_id: posts._id });
                }
              });
            }
          }}
          style={styles.bottomBar}>

          <View style={{flex:1}}>
            <Text style={{color:'#9a9a9a'}}>回帖参与讨论 ...</Text>
          </View>

          <View style={{ flexDirection:'row' }}>

            <View>
              <LikeButton
                posts={posts}
                onFinish={()=>{
                  // this.componentWillMount();
                }}
                buttonType="max-black"
                buttonStyle={{
                  height:45,
                  paddingRight:15,
                  paddingLeft:15,
                  justifyContent:'center',
                  alignItems:'center'
                }}
                />
            </View>

            <View>
              <ShareButton
                posts={posts}
                buttonStyle={{
                  height:45,
                  paddingRight:15,
                  paddingLeft:15,
                  justifyContent:'center',
                  alignItems:'center'
                }}
                />
            </View>

            <View>
              <ReportMenu
                posts={posts}
                navigation={navigation}
                buttonType='black'
                buttonStyle={{
                  height:45,
                  paddingRight:15,
                  paddingLeft:15,
                  justifyContent:'center',
                  alignItems:'center'
                }}
                />
            </View>

          </View>

        </TouchableOpacity>

      </View>)
  }
}
