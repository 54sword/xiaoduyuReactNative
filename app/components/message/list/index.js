
/**
 * 帖子列表组件
 *
 * @params {String} id 列表id - id 相同可以避免重复加载数据
 * @params {String} filters 筛选条件
 * @params {String} [itemType] 显示列表项的类型
 * @params {Boolean} [showPagination] 是否显示翻页
 * @params {Boolean} [scrollLoad] 是否开启滚动到底部加载更多
 */

import React, { Component } from 'react';
import { View, Text, RefreshControl, FlatList } from 'react-native';
import PropTypes from 'prop-types';

// 依赖的外部功能
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadMessageList } from '../../../store/actions/message';
import { getMessageListById } from '../../../store/reducers/message';

// 依赖组件
// import Pagination from '@components/pagination';
// import Loading from '@components/ui/content-loading';
import Item from './components/list-item';
import ListFooter from '../../ui/list-footer';


// styles
// import './index.scss';

@connect(
  (state, props) => ({
    list: getMessageListById(state, props.id)
  }),
  dispatch => ({
    loadList: bindActionCreators(loadMessageList, dispatch)
  })
)
export default class MessageList extends Component {

  static propTypes = {
    // 列表id
    id: PropTypes.string.isRequired,
    // 列表的筛选条件
    filters: PropTypes.object.isRequired
  }
  
  static defaultProps = {
    // 是否显示tips
    showTips: false
  }

  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
      // 手动刷新
      refreshing: false
    }
    this.loadDate = this.loadDate.bind(this);
    this.onScroll = this.onScroll.bind(this);
    // this._onRefresh = this._onRefresh.bind(this);
  }

  async componentDidMount() {
    const { list } = this.props;
    if (!list.data) await this.loadDate();
  }

  async onScroll(event) {

    const { more } = this.props.list;

    if (!this.state.loading && more) {
      this.state.loading = true;
      await this.loadDate();
      this.state.loading = false;
    }

  }

  /*
  async _onRefresh(toTop) {

    if (this.state.isRefreshing) return;
    this.state.isRefreshing = true;

    this.setState({ isRefreshing: true }, ()=>{

      if (toTop && this.listRef) {
        this.listRef && this.listRef.scrollToOffset({offset: -70, animated: true});
      }

      setTimeout(async ()=>{
        await this.loadPostsList(true);
        this.setState({
          isRefreshing: false
        });
      }, 500);

    });


  }
  */
  
  loadDate(restart = false) {
    const { id, filters, loadList } = this.props;
    let _filters = JSON.parse(JSON.stringify(filters));
    return loadList({ id, filters: _filters, restart });
  }


  render () {
    
    const { list } = this.props;
    const { data = [], loading, more = true, count, filters = {} } = list;
    
    let _data = data.concat();

    let inverted = 1;

    if (_data.length < 10) {
      inverted = 0;
    } else {
      _data.reverse();
    }

    let params = {
      inverted,
      keyExtractor: item => item._id,
      renderItem: ({ item, index, section }) => <Item key={item._id} message={item} />,
      data: _data,
      ListHeaderComponent:<View style={{minHeight:6}}></View>,
      ListFooterComponent:()=><ListFooter loading={list.loading} more={list.more} />,
      ItemSeparatorComponent:()=><View style={{height:6}}></View>,
      ListEmptyComponent:()=>{
        if (!list.loading && list.data && list.data.length == 0 && !list.data.more) {
          return <View style={{padding:30,alignItems:'center'}}><Text>没有数据</Text></View>
        } else {
          return null
        }
      },
      removeClippedSubviews: false,
      // refreshControl:(
      //   <RefreshControl
      //     ref="refreshing"
      //     refreshing={this.state.isRefreshing}
      //     onRefresh={this._onRefresh}
      //     tintColor="#484848"
      //     title="加载中..."
      //     titleColor="#484848"
      //     colors={['#ff0000', '#00ff00', '#0000ff']}
      //     progressBackgroundColor="#ffffff"
      //   />
      // ),
      onEndReached:this.onScroll,
      onEndReachedThreshold:0.1,
      initialNumToRender:5,
    }

    return <FlatList {...params} />
  }

}
