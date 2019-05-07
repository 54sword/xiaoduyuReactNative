
import React, { Component } from 'react';
import { Text, View, FlatList, RefreshControl, PixelRatio } from 'react-native';

import PropTypes from 'prop-types';

// 依赖的外部功能
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadSessionList } from '../../../store/actions/session';
import { getSessionListById } from '../../../store/reducers/session';

// 依赖组件
// import Pagination from '@components/pagination';
// import Loading from '@components/ui/content-loading';

import Item from './components/list-item';

import ListFooter from '../../../components/ui/list-footer';
// import ItemPoor from './components/item-poor';
// import NewTips from './components/new-tips';

// styles
// import './index.scss';

@connect(
  (state, props) => ({
    // isMember: isMember(state),
    list: getSessionListById(state, props.id)
  }),
  dispatch => ({
    loadList: bindActionCreators(loadSessionList, dispatch)
  })
)
export default class SessionList extends Component {

  static propTypes = {
    // 列表id
    id: PropTypes.string.isRequired,
    // 列表的筛选条件
    filters: PropTypes.object.isRequired
  }

  static defaultProps = {
    // 显示项
    // itemType: 'rich',
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
      loading: true
    }
    this.loadDate = this.loadDate.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    const { id, list, scrollLoad } = this.props;
    if (!list.data) this.loadDate();
    if (scrollLoad) ArriveFooter.add(id, this.loadDate);
  }
  
  componentWillUnmount() {
    const { id, scrollLoad } = this.props;
    if (scrollLoad) ArriveFooter.remove(id);
  }

  // componentWillReceiveProps(props) {
    // if (this.props.id != props.id) {
    //   this.componentWillUnmount();
    //   this.props = props;
    //   this.componentDidMount();
    // }
  // }

  loadDate(restart = false) {
    const { id, filters, loadList } = this.props;
    let _filters = JSON.parse(JSON.stringify(filters));
    loadList({ id, filters: _filters, restart });
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
    
    const { id, list, itemType, showPagination, showTips, isMember, scrollLoad } = this.props;
    const { data, loading, more = true, count, filters = {} } = list;

    // 没有结果
    // if (!loading && data && data.length == 0 && !more) {
    //   return <View><Text>没有数据</Text></View>
    // }

    let params = {
      // _onRefresh: this._onRefresh,
      // getRef:c => {
      //   if (c) {
      //     getRef(c.getNode());
      //     this.listRef = c.getNode();
      //   }
      // },
      keyExtractor: item => item._id,
      renderItem: ({ item, index, section }) => <Item key={item._id} message={item} />,
      data: list.data,
      // ListHeaderComponent:<View style={{minHeight:5}}></View>,
      ListFooterComponent:()=><ListFooter loading={list.loading} more={list.more} />,
      // ItemSeparatorComponent:()=><View style={{height:6}}></View>,
      ItemSeparatorComponent:()=><View style={{height:1/PixelRatio.get(),backgroundColor:'#cdced2',marginLeft:80}}></View>,
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
      initialNumToRender:5
    }

    return <FlatList {...params} />

    return (<>
      
      <View>
          {data && data.map(item=>{
            return (<Item key={item._id} message={item} />)
          })}
      </View>

      {/*!more || !scrollLoad ? null : <Loading />*/}

      {/*showPagination &&
        <Pagination
          count={count || 0}
          pageSize={filters.page_size || 0}
          pageNumber={filters.page_number || 0}
        />
      */}

    </>)
  }

}
