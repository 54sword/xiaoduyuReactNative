
import React, { PureComponent } from 'react';
import { Text, View, ListView, refreshControl, RefreshControl, TouchableOpacity, FlatList, Animated } from 'react-native';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getProfile } from '../../../reducers/user';
import { loadCommentList } from '../../../actions/comment';
import { getCommentListByName } from '../../../reducers/comment';

// components
import CommentItem from '../list-item';
// import Loading from '../../../components/ui/loading';
import Nothing from '../../../components/nothing';
import HtmlView from '../../html-view';
import ListFooter from '../../../components/ui/list-footer';

// styles
import styles from './styles';



@connect(
  (state, props) => ({
    me: getProfile(state),
    list: getCommentListByName(state, props.name)
  }),
  dispatch => ({
    loadCommentList: bindActionCreators(loadCommentList, dispatch)
  })
)
export default class CommentList extends PureComponent {

  constructor (props) {
    super(props)
    this.state = {
      isRefreshing: false
    }
    this.goTo = this.goTo.bind(this);
    this.load = this.load.bind(this);
    // this.renderFooter = this.renderFooter.bind(this)
    this.toPosts = this.toPosts.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  AnimatedComponent = Animated.createAnimatedComponent(FlatList)

  componentWillMount() {
    const { list } = this.props;
    if (!list.data || !list.data.length) {
      this.load()
    }
  }

  load(restart = false) {
    const { name, filters } = this.props
    return this.props.loadCommentList({ name, filters, restart })
  }

  toPosts(posts){
    const { navigate } = this.props.navigation;
    navigate('PostsDetail', { title: posts.title, id: posts._id })
  }


  goTo(posts){
    const { navigate } = this.props.navigation;
    navigate('PostsDetail', { title: posts.title, id: posts._id })
  }

  async onScroll(event) {

    const { more } = this.props.list;

    if (!this.state.loading && more) {
      
      this.state.loading = true
      await this.load();
      this.state.loading = false
    }

    /*
    const self = this
    const y = event.nativeEvent.contentOffset.y;
    const height = event.nativeEvent.layoutMeasurement.height;
    const contentHeight = event.nativeEvent.contentSize.height;

    if (y + height >= contentHeight - 50 && !self.state.loading) {
      self.state.loading = true
      await self.load();
      self.state.loading = false
    }
    */

  }

  async _onRefresh() {
    const self = this
    this.setState({ isRefreshing: true })
    await self.load(true)
    self.setState({ isRefreshing: false })
  }

  _listRef: FlatList<*>

  render() {

    const {
      list,
      displayLike = false,
      displayReply = false,
      displayCreateAt = false,
      canClick = true,
      // 只显示评论
      onlyDisplayComment = false,
      renderHeader = null,
      me,
      onScroll = ()=>{},
      getRef=()=>{}
    } = this.props

    const { navigate } = this.props.navigation;

    let renderRow = ({ item }) => (<View style={{backgroundColor:'#fff'}}>

        {/*<View><Text>{item.posts_id.title}</Text></View>*/}

        <CommentItem {...this.props} displayLike={displayLike} displayReply={displayReply} displayCreateAt={displayCreateAt} canClick={canClick} comment={item} onlyDisplayComment={onlyDisplayComment} />

        {!onlyDisplayComment && item.reply && item.reply.map(item=>{
          return(<View key={item._id} style={styles.reply}>
            <CommentItem {...this.props} displayLike={displayLike} displayReply={displayReply} displayCreateAt={displayCreateAt} canClick={canClick} comment={item} subitem={true} />
          </View>)
        })}

        {!onlyDisplayComment && item.reply && item.reply_count > item.reply.length ?
          <TouchableOpacity
            onPress={()=>{
              navigate('CommentDetail', { title: item.content_summary, id: item._id })
            }}
            style={styles.more}>
            <Text style={styles.moreText}>还有 {item.reply_count - item.reply.length} 条回复，查看全部</Text>
          </TouchableOpacity>
          : null}

      </View>)

    /*
    if (onlyDisplayComment) {

      renderRow = (item) => (<View style={styles.commentItem}>
          <View><Text>{item._create_at}</Text></View>
          <TouchableOpacity style={styles.postsTitle} onPress={()=>{ this.toPosts(item.posts_id) }}>
            <Text style={styles.postsTitleText}>{item.posts_id.title}</Text>
          </TouchableOpacity>
          <View><HtmlView html={item.content_html} imgOffset={20} /></View>
        </View>)

    }
    */

    // console.log(list);

    return (
      <this.AnimatedComponent
        style={{ flex:1 }}
        keyExtractor={item => item._id}
        renderItem={renderRow}
        data={list.data}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={()=><ListFooter loading={list.loading} more={list.more} />}
        // ItemSeparatorComponent={()=><View style={{height:7}}></View>}
        ListEmptyComponent={()=>{
          if (!list.loading && list.data && list.data.length == 0 && !list.data.more) {
            return (<View style={{padding:30,alignItems:'center'}}>
              <Text></Text>
            </View>)
          } else {
            return null
          }
        }}
        refreshing={list.loading}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={this.state.isRefreshing}
        //     onRefresh={this._onRefresh.bind(this)}
        //     tintColor="#484848"
        //     title="加载中..."
        //     titleColor="#484848"
        //     colors={['#ff0000', '#00ff00', '#0000ff']}
        //     progressBackgroundColor="#ffffff"
        //   />
        // }
        onEndReached={this.onScroll}
        onEndReachedThreshold={0.1}
        initialNumToRender={5}
        onScroll={onScroll}
        ref={(e)=>{
          // this._listRef = e;
          // console.log(this._listRef.getNode());
          getRef(e);
        }}
      />)

    /*
    return (<ListView
          renderHeader={renderHeader}
          enableEmptySections={true}
          dataSource={array}
          renderRow={renderRow}
          renderFooter={()=><ListFooter loading={list.loading} more={list.more} />}
          removeClippedSubviews={false}
          onScroll={this.onScroll.bind(this)}
          scrollEventThrottle={50}
        />)
    */
  }


}
