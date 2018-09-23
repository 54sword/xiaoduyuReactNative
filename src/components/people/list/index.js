import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadPeopleList } from '../../../actions/people';
import { getPeopleListByName } from '../../../reducers/people';

// components
import FollowButton from '../../follow/button';
import ListFooter from '../../ui/list-footer';

// styles
import styles from './styles';

@connect(
  (state, props) => ({
    list: getPeopleListByName(state, props.name)
  }),
  dispatch => ({
    loadList: bindActionCreators(loadPeopleList, dispatch)
  })
)
export default class PeopleList extends Component{

  static propTypes = {
    // 列表名称
    name: PropTypes.string.isRequired,
    // 列表的筛选条件
    filters: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {}
    this.load = this.load.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    const { name, list } = this.props
    if (!list.data || list.data.length == 0) this.load();
  }

  componentWillReceiveProps(props) {
    if (props.name != this.props.name) {
      this.props = props
      this.load(true)
    }
  }

  load(restart) {
    const { name, filters, loadList } = this.props
    loadList({ name: name, filters: filters, restart })
  }

  async onScroll(event) {

    const { more } = this.props.list;
    
    if (!this.state.loading && more) {
      this.state.loading = true;
      await this.load();
      this.state.loading = false;
    }
  }

  render () {

    const { list, navigation } = this.props;
    return (
      <FlatList
        keyExtractor={item => item._id}
        renderItem={(item)=>{
          let people = item.item;

          return (<TouchableOpacity key={people._id} style={styles.people} onPress={()=>{
            navigation.push('PeopleDetail', { title: people.nickname, id: people._id });
          }}>

            <View style={styles.peopleHead}>

              <View>
                <Image source={{uri: 'https:'+people.avatar_url}} style={styles.peopleAvatar} />
              </View>

              <View style={{flex:1}}>
                <Text style={styles.peopleNickname}>{people.nickname}</Text>
                {people.brief ? <Text style={styles.peopleBrief}>{people.brief}</Text> : null}
                <View style={styles.peopleStatus}>
                  {people.posts_count ? <Text style={styles.peopleItem}>{people.posts_count} 帖子</Text> : null}
                  {people.comment_count ? <Text style={styles.peopleItem}>{people.comment_count} 评论</Text> : null}
                  {people.fans_count ? <Text style={styles.peopleItem}>{people.fans_count} 粉丝</Text> : null}
                </View>
              </View>

            </View>

            <View style={{marginRight:15}}>
              <FollowButton user={people} />
            </View>

          </TouchableOpacity>)

        }}
        data={list.data}
        ListHeaderComponent={<View style={{height:6}}></View>}
        ListFooterComponent={()=><ListFooter loading={list.loading} more={list.more} />}
        // ItemSeparatorComponent={()=><View style={{height:7}}></View>}
        ListEmptyComponent={()=>{
          if (!list.loading && list.data && list.data.length == 0 && !list.data.more) {
            return <View style={{padding:30,alignItems:'center'}}><Text>没有数据</Text></View>
          } else {
            return null
          }
        }}
        // refreshing={list.loading}
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
      />
    )

  }

}
