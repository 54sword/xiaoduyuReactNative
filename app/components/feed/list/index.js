import React, { Component } from 'react';
import { View, Text, RefreshControl, FlatList, PixelRatio } from 'react-native';
import PropTypes from 'prop-types';

// 依赖的外部功能
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadFeedList } from '../../../store/actions/feed';
import { getFeedListById } from '../../../store/reducers/feed';

// 依赖组件
import PostsListItem from '../../posts/list-item';
import ListFooter from '../../../components/ui/list-footer';
import CommentItem from '../item-comment';

// import Pagination from '@components/pagination';
// import Loading from '@components/ui/content-loading';
// import Loading from '@components/ui/content-loading';
import NewTips from './components/new-tips';

// styles
import styles from './styles.js';

/**
 * 帖子列表组件
 *
 * @params {String} id 列表id - id 相同可以避免重复加载数据
 * @params {String} filters 筛选条件
 * @params {String} [itemName] 显示那种样式
 * @params {Boolean} [showPagination] 是否显示翻页
 * @params {Boolean} [scrollLoad] 是否开启滚动到底部加载更多
 */
@connect(
  (state, props) => ({
    list: getFeedListById(state, props.id)
  }),
  dispatch => ({
    loadList: bindActionCreators(loadFeedList, dispatch)
  })
)
export default class PostsList extends Component {

  static propTypes = {
    // 列表id
    id: PropTypes.string.isRequired,
    // 列表的筛选条件
    filters: PropTypes.object.isRequired
  }

  static defaultProps = {
    // 显示项
    // itemName: 'posts-item',
    // 是否显示翻页
    showPagination: false,
    // 滚动底部加载更多
    scrollLoad: false,
    // 是否显示tips
    showTips: false
  }

  constructor(props) {
    super(props);
    this.state = {
      loadMore: false,
      isRefreshing: false,
      loading: false,
      contentOffsetY: 0,
      // 手动刷新
      refreshing: false
    }
    this.loadDate = this.loadDate.bind(this)

    this.onScroll = this.onScroll.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  componentDidMount() {
    const { list, id, scrollLoad } = this.props;
    if (!list.data) this.loadDate();
    // if (scrollLoad) ArriveFooter.add(id, this.loadDate);
  }

  componentWillUnmount() {
    const { id, scrollLoad } = this.props;
    // if (scrollLoad) ArriveFooter.remove(id);
  }

  componentWillReceiveProps(props) {

    if (props.id != this.props.id) {
      this.componentWillUnmount();
      this.props = props;
      this.componentDidMount();
    }

  }

  async loadDate(restart = false) {
    const { id, filters, loadList } = this.props;
    let _filters = JSON.parse(JSON.stringify(filters));
    await loadList({ id, filters: _filters, restart });
  }

  renderHeader() {
    const { renderHeader, showTips, id } = this.props;
    const { loading } = this.props.list;
    
    // if (renderHeader) return renderHeader;

    return (<View>
      {renderHeader}
      {!loading && showTips ? <NewTips topicId={id} /> : null}
    </View>)
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
        await this.loadDate(true);
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

  async onScroll(event) {

    const { more } = this.props.list;

    if (!this.state.loading && more) {
      this.state.loading = true;
      await this.loadDate();
      this.state.loading = false;
    }

  }


  render () {

    const { id, list, showPagination, showTips, scrollLoad, getRef = ()=>{} } = this.props;
    const { data, loading, more = true, count, filters = {} } = list;
    const { navigation } = this.props;
    
    // 没有结果
    if (!loading && data && data.length == 0 && !more) {
      return <View style={styles.nothing}>
        <Text style={styles.nothingText}>关注你感兴趣的人或话题，可以获得ta们的最新动态</Text>
      </View>
    }

    let params = {
      _onRefresh: this._onRefresh,

      ref: c => {
        if (c) {
          getRef(c);
          this.listRef = c;
        }
      },

      // getRef:c => {

      //   console.log('pppp=====')
      //   if (c) {
      //     getRef(c.getNode());
      //     this.listRef = c.getNode();
      //   }
      // },
      keyExtractor: item => 'name-'+item._id,
      renderItem: ({ item, index, section }) => {

        if (item.comment_id) {
          // console.log(item);
          item.comment_id.posts_id = item.posts_id;
          // return null
          return <CommentItem
                  {...this.props}
                  displayLike={false}
                  displayReply={false}
                  displayCreateAt={true}
                  comment={item.comment_id}
                  onlyDisplayComment={false}
                  />
          // return (<CommentItem key={item._id} posts={item.posts_id} comment={item.comment_id} />)
        } else if (item.posts_id) {
          // return null;
          return (<PostsListItem key={item._id} posts={item.posts_id} navigation={navigation} />)
        } else {
          return null
        }

        // return <PostsListItem posts={item} navigation={navigation} hideUserInfo={hideUserInfo} />
      },
      data: list.data,
      ListHeaderComponent:this.renderHeader,
      ListFooterComponent:()=><ListFooter loading={list.loading} more={list.more} />,
      // ItemSeparatorComponent:()=><View style={{height:1/PixelRatio.get(),backgroundColor:'#cdced2',marginLeft:15,marginRight:15}}></View>,
      ItemSeparatorComponent:()=><View style={{height:7,backgroundColor:'#f8f8f8'}}></View>,
      // ItemSeparatorComponent:()=><View style={{height:6}}></View>,
      ListEmptyComponent:()=>{
        if (!list.loading && list.data && list.data.length == 0 && !list.data.more) {
          return <View style={{padding:30,alignItems:'center'}}><Text>没有数据</Text></View>
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

    return <FlatList {...params} />
  }

}
