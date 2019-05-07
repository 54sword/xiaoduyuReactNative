
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, ListView, Image, ScrollView, TouchableOpacity, RefreshControl, FlatList, PixelRatio, Animated } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Collapsible from 'react-native-collapsible-header';
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper';

import { loadPostsList } from '../../../store/actions/posts';
import { getPostsListById } from '../../../store/reducers/posts';

import styles from './styles';
import Loading from '../../../components/ui/loading';
import ListFooter from '../../../components/ui/list-footer';
import PostsListItem from '../list-item';


@connect(
  (state, props) => ({
    list: getPostsListById(state, props.name)
  }),
  dispatch => ({
    loadPostsList: bindActionCreators(loadPostsList, dispatch)
  })
)
export default class PostsList extends Component {

  static defaultProps = {
    // header 内容
    renderHeader: null,
    collapsible: false
  }

  constructor (props) {
    super(props);

    // var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      loadMore: false,
      isRefreshing: false,
      loading: false,
      contentOffsetY: 0,
      // 手动刷新
      refreshing: false
    }
    // this.goTo = this.goTo.bind(this);
    // this.goToComment = this.goToComment.bind(this);
    this.loadPostsList = this.loadPostsList.bind(this);
    // this.toPeople = this.toPeople.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }


  componentDidMount() {

    const self = this
    // 将 scroll view 传递给父组件
    const { getRef = ()=>{}, onRefresh = ()=>{}, list, collapsible } = this.props;

    if (!list.data) this.loadPostsList();

    // console.log(this.refs['list']);


      // getRef(this.myRef);


    // onRefresh(()=>{
      // self._onRefresh()
    // })

    // setTimeout(()=>{
    //   let scrollView = this.refs['scroll-view']
    //   console.log(scrollView.scrollTo({
    //     x: 0,
    //     y: 200,
    //     animated: true
    //   }))
    // }, 1000)


  }

  async loadPostsList(restart) {
    const { name, filters, loadPostsList } = this.props;
    return await loadPostsList({ id: name, filters, restart });
  }

  /*
  toPeople(people) {
    const { navigate } = this.props.navigation;
    navigate('PeopleDetail', { title: people.nickname, id: people._id });
  }

  goTo(posts){
    const { navigate } = this.props.navigation;

    // navigate('PostsDetail', { title: posts.title, id: '58b2850ed8831fe9027a5f92' })
    navigate.push('PostsDetail', { title: posts.title, id: posts._id })
  }

  goToComment(comment) {
    const { navigate } = this.props.navigation;
    navigate('CommentDetail', { title: comment.content_summary, id: comment._id })
  }
  */

  renderHeader() {
    const { renderHeader } = this.props;
    const { refreshing } = this.state;

    if (renderHeader) return renderHeader;

    return null//(<View style={{minHeight:6}}></View>)
  }

  async _onRefresh(toTop) {

    // console.log(this.refs.refreshing);

    // if (toTop) {
      // this.handleRefresh();
      // return;
    // }

    if (this.state.isRefreshing) return;
    this.state.isRefreshing = true;

    this.setState({ isRefreshing: true }, ()=>{

      // console.log('111');

      if (toTop && this.listRef) {
        // this.listRef.scrollToIndex({ viewPosition: 0, index: 0, animated: true });
        this.listRef && this.listRef.scrollToOffset({offset: -70, animated: true});
      }

      setTimeout(async ()=>{
        await this.loadPostsList(true);
        this.setState({
          isRefreshing: false
        });

        // console.log(this.refs.refreshing);

        // this.refs.refreshing.updater.enqueueForceUpdate('1', ()=>{
        //
        // });

        // resolve();
      }, 500);

    });


  }

  async handleRefresh() {

    this.setState({ refreshing: true });

    /*
    if (toTop && this.listRef) {
      this.listRef.scrollToIndex({ viewPosition: 0, index: 0, animated: true });
    }

    setTimeout(async ()=>{
      await this.loadPostsList(true);
      this.setState({
        refreshing: false
      });
    }, 500);
    */

  }

  // setRefreshControl () {
    // this.refreshControl =
  // }


  async onScroll(event) {

    const { more } = this.props.list;

    if (!this.state.loading && more) {
      this.state.loading = true;
      await this.loadPostsList();
      this.state.loading = false;
    }

  }

  render() {

    const self = this
    const {
      name,
      list,
      // 是否显示用户信息
      hideUserInfo = false,
      // 自定义header
      // renderHeader,
      navigation,
      renderHeader,
      collapsible,
      getRef = ()=>{}
      // onScroll
    } = this.props;
    // const { refreshing } = this.state;

    // console.log(this.state.isRefreshing);

    let params = {
      _onRefresh: this._onRefresh,
      getRef:c => {
        if (c) {
          getRef(c.getNode());
          this.listRef = c.getNode();
        }
      },
      keyExtractor: item => 'name-'+item._id,
      renderItem: ({ item, index, section }) => <PostsListItem posts={item} navigation={navigation} hideUserInfo={hideUserInfo} />,
      data: list.data,
      // ListHeaderComponent:<View style={{minHeight:6}}></View>,
      ListFooterComponent:()=><ListFooter loading={list.loading} more={list.more} />,
      ItemSeparatorComponent:()=><View style={{height:7,backgroundColor:'#f8f8f8'}}></View>,
      // ItemSeparatorComponent:()=><View style={{height:1/PixelRatio.get(),backgroundColor:'#cdced2',marginLeft:15,marginRight:15}}></View>,
      ListEmptyComponent:()=>{
        if (!list.loading && list.data && list.data.length == 0 && !list.data.more) {
          return (<View style={{ padding:30, alignItems:'center' }}>
            <Text style={{ color:'#999', textAlign:'center', width: 250, lineHeight: 20 }}>收藏你感兴趣的帖子，可以获得帖子的最新动态</Text>
          </View>)
        } else {
          return null
        }
      },
      removeClippedSubviews: false,
      // refreshing: this.state.isRefreshing,
      // onRefresh: this._onRefresh,
      // refreshControl: (<Text>loading...</Text>),
      // onRefresh: ()=>{
      //   console.log('触发更细');
      // },
      refreshControl:(
        <RefreshControl
          ref="refreshing"
          refreshing={this.state.isRefreshing}
          onRefresh={this._onRefresh}
          tintColor="#484848"
          title="加载中..."
          titleColor="#484848"
          colors={['#ff0000', '#00ff00', '#0000ff']}
          progressBackgroundColor="#ffffff"
        />
      ),
      onEndReached:this.onScroll,
      onEndReachedThreshold:0.1,
      initialNumToRender:5,
      // getItemLayout: (data, index) => (
      //   { length: 150, offset: 150 * index, index }
      // )
      // onScroll: this.onScroll
    }

    if (collapsible) {

      let min = 0;

      // if (global.OS == 'ios') {
      //   min = isIphoneX() ? 35 : 20;
      // }

      return (
        <Collapsible
          max={45}
          min={min}
          backgroundColor={'#fff'}
          renderHeader={renderHeader}
          flatList={true}
          {...params}
        />
      );
    } else {
      params.ListHeaderComponent = this.renderHeader;
      params.ref = c => {
        if (c) {
          getRef(c);
          this.listRef = c;
        }
      }
    }

    // let AnimatedComponent = Animated.createAnimatedComponent(FlatList);

    // return <AnimatedComponent {...params} />;

    return <FlatList {...params} />

    /*
    return (
        <ListView
          enableEmptySections={true}
          dataSource={topics}

          renderRow={(posts, s, index) => {
            // console.log(index);
            return (<PostsListItem posts={posts} navigation={navigation} hideUserInfo={hideUserInfo} />)
          }}
          renderHeader={this.renderHeader}
          renderFooter={()=><ListFooter loading={list.loading} more={list.more} />}
          removeClippedSubviews={false}
          onScroll={this.onScroll}
          onChangeVisibbleRows={(s)=>{
            console.log(s);
          }}
          // scrollEventThrottle={3}
          ref='scroll-view'
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh.bind(this)}
              tintColor="#484848"
              title="加载中..."
              titleColor="#484848"
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor="#ffffff"
            />
          }
        />
    )
    */
  }

}
