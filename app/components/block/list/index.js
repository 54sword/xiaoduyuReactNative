
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ListView, View, Text, Image, RefreshControl, FlatList } from 'react-native';
import Swipeout from 'react-native-swipeout';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { removeBlock, loadBlockList } from '../../../store/actions/block';
import { getBlockListById } from '../../../store/reducers/block';

// 构建组件
import Loading from '../../ui/loading';
import Nothing from '../../nothing';
import ListFooter from '../../ui/list-footer';
// import RefreshControl from '../ui/refresh-control'
// import ListViewOnScroll from '../../../common/list-view-onscroll';
// import PeopleItem from '../../people-item';
// import PostsItem from '../../posts-item';
// import CommentItem from '../../comment/list-item';

// 公共样式
import gStyles from '../../../styles';
import styles from './styles';

@connect(
  (state, props) => ({
    list: getBlockListById(state, props.name)
  }),
  dispatch => ({
    loadList: bindActionCreators(loadBlockList, dispatch),
    removeBlock: bindActionCreators(removeBlock, dispatch)
  })
)
export default class BlockList extends Component {

  static propTypes = {
    name: PropTypes.string,
    filters: PropTypes.object
  }

  constructor (props) {
    super(props);
    this.state = { isRefreshing: false };
    this.loadList = this.loadList.bind(this);
    this.remove = this.remove.bind(this);

    this.onRefresh = this.onRefresh.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  componentWillMount() {
    const { list } = this.props;
    if (!list.data) this.loadList();
  }

  async loadList(callback = ()=>{}, restart) {
    const { name, filters, loadList } = this.props;
    await loadList({ id: name, args:filters, restart });
    callback();
  }

  onRefresh() {
    const self = this;
    this.setState({ isRefreshing: true });
    this.loadList(()=>{
      self.setState({ isRefreshing: false });
    }, true);
  }

  async onScroll(event) {

    const { more } = this.props.list;

    if (!this.state.loading && more) {
      this.state.loading = true;
      await this.loadList();
      this.state.loading = false;
    }

  }

  async remove(item) {

    const { removeBlock } = this.props;

    let params = {};

    if (item.people_id) params.people_id = item.people_id._id;
    if (item.posts_id) params.posts_id = item.posts_id._id;
    if (item.comment_id) params.comment_id = item.comment_id._id;

    let [ err, res ] = await removeBlock({ args: params, id: item._id });

    if (err) Alert.alert(err.message);

  }

  renderRow({ item }) {

    const self = this;

    var swipeoutBtns = [
      {
        text: '取消屏蔽',
        onPress: () => self.remove(item),
        backgroundColor: 'rgb(238, 38, 38)',
        color: '#fff'
      }
    ]

    return (<View key={item._id}>
      <Swipeout right={swipeoutBtns} backgroundColor="#e6e6ed">
        {item.posts_id ?
          <View style={styles.postsView}><Text>{item.posts_id.title}</Text></View>
          : null}
        {item.comment_id ?
          <View style={styles.commentView}><Text>{item.comment_id.content_summary}</Text></View>
          : null}
        {item.people_id ?
          <View style={styles.peopleView}>
            <View><Image style={styles.avatar} source={{uri:'https:'+item.people_id.avatar_url}} /></View>
            <View><Text>{item.people_id.nickname}</Text></View>
          </View>
          : null}
      </Swipeout>
    </View>)

  }

  render() {

    const self = this;
    const { list, filters, removeBlock } = this.props;

    if (list.loading && list.data.length == 0 || !list.data) return (<Loading />);
    if (!list.loading && !list.more && list.data.length == 0) return (<Nothing content="没有数据" />);

    // var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    // let data = ds.cloneWithRows(list.data || []);

    return (
      <FlatList
        keyExtractor={item => item._id}
        renderItem={this.renderRow}
        data={list.data}
        // ListHeaderComponent={this.renderHeader}
        ListFooterComponent={()=><ListFooter loading={list.loading} more={list.more} />}
        ItemSeparatorComponent={()=><View style={{height:7}}></View>}
        ListEmptyComponent={()=>{
          if (!list.loading && list.data && list.data.length == 0 && !list.data.more) {
            return <View style={{padding:30,alignItems:'center'}}><Text>没有数据</Text></View>
          } else {
            return null
          }
        }}
        refreshing={list.loading}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this.onRefresh}
            tintColor="#484848"
            title="加载中..."
            titleColor="#484848"
            colors={['#ff0000', '#00ff00', '#0000ff']}
            progressBackgroundColor="#ffffff"
          />
        }
        onEndReached={this.onScroll}
        onEndReachedThreshold={0.1}
        initialNumToRender={5}
      />
    )

    return (
        <ListView
          enableEmptySections={true}
          dataSource={data}
          renderRow={this.renderRow}
          renderFooter={()=><ListFooter loading={list.loading} more={list.more} />}
          removeClippedSubviews={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefresh}
              tintColor="#484848"
              title="加载中..."
              titleColor="#484848"
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor="#ffffff"
            />
          }
          onScroll={this.onScroll}
          scrollEventThrottle={50}
        />
    )
  }

}
