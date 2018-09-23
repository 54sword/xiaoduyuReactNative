import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, Text, Image, ListView, TouchableOpacity, FlatList } from 'react-native';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { findFollows } from '../../../actions/follow';
import { getFollowListByName } from '../../../reducers/follow';

// components
import FollowButton from '../button';
import ListFooter from '../../ui/list-footer';

// styles
import styles from './styles';


@connect(
  (state, props) => ({
    list: getFollowListByName(state, props.id)
  }),
  dispatch => ({
    load: bindActionCreators(findFollows, dispatch)
  })
)
export default class CommentList extends Component {

  static propTypes = {
    // 列表名称
    id: PropTypes.string.isRequired,
    // 列表的筛选条件
    args: PropTypes.object.isRequired,
    // 获取数据
    fields: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {}
    this.load = this.load.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    const { id, list } = this.props
    if (!list.data || list.data.length == 0) this.load();
    // if (scrollLoad) ArriveFooter.add(id, this.load);
  }

  componentWillUnmount() {
    // const { id, scrollLoad } = this.props;
    // if (scrollLoad) ArriveFooter.remove(id);
  }

  componentWillReceiveProps(props) {
    if (props.id != this.props.id) {
      this.componentWillUnmount();
      this.props = props;
      this.componentDidMount();
    }
  }

  load() {
    const { id, args, fields, load } = this.props;
    load({ id, args, fields });
  }

  async onScroll(event) {

    const { more } = this.props.list;

    if (!this.state.loading && more) {
      this.state.loading = true;
      await this.load();
      this.state.loading = false;
    }

    /*
    const self = this
    const y = event.nativeEvent.contentOffset.y;
    const height = event.nativeEvent.layoutMeasurement.height;
    const contentHeight = event.nativeEvent.contentSize.height;

    if (y + height >= contentHeight - 50 && !self.state.loading) {
      self.state.loading = true;
      await self.load();
      self.state.loading = false;
    }
    */

  }

  render () {

    const { list, navigation } = this.props;

    // var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    // let topics = ds.cloneWithRows(list.data || []);

    // console.log(list.data);

    let renderRow = ({ item }) => {

      let people = item.people_id || item.user_id || null;
      let posts = item.posts_id || null;
      let topic = item.topic_id || null;

      if (topic) {

        return (<TouchableOpacity key={topic._id}  style={styles.topic} onPress={()=>{
          navigation.push('TopicDetail', { id: topic._id, title: topic.name });
        }}>

          <View style={styles.topicInfo}>
            <View>
              <Image source={{uri: 'https:'+topic.avatar }} style={styles.topicAvatar} />
            </View>
            <View style={{ flex:1 }}>
              <Text style={styles.topicName}>{topic.name}</Text>
              <Text>{topic.brief}</Text>
            </View>
          </View>

          <View style={{marginRight:15}}>
            <FollowButton topic={topic} />
          </View>

        </TouchableOpacity>)

      } else if (posts) {

        return (<TouchableOpacity key={posts._id} style={styles.posts} onPress={()=>{
          // navigation.push('TopicDetail', { id: topic._id, title: topic.name });
          navigation.push('PostsDetail', { id: posts._id, title: posts.title });
        }}>
          <View style={styles.postsTitle}>
            <Text>{posts.title}</Text>
          </View>
          <View style={{marginRight:15}}>
            <FollowButton posts={posts} />
          </View>
        </TouchableOpacity>)

      } else if (people) {

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
      }
    }


    return (
      <FlatList
        keyExtractor={item => {

          let people = item.people_id || item.user_id || null;
          let posts = item.posts_id || null;
          let topic = item.topic_id || null;

          let obj = people || posts || topic;

          return obj._id
        }}
        renderItem={renderRow}
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
      />
    )

    /*
    return (<ListView
              enableEmptySections={true}
              dataSource={topics}

              renderRow={(item, index) => {



              }}
              renderFooter={()=><ListFooter loading={list.loading} more={list.more} />}
              removeClippedSubviews={false}
              onScroll={this.onScroll}
              scrollEventThrottle={50}
            />)


    return (<ScrollView>

      {data && data.map((item, index)=>{

        let people = item.people_id || item.user_id || null;
        let posts = item.posts_id || null;
        let topic = item.topic_id || null;

        if (topic) {
          return (<View key={topic._id}>
            <View>
              <View>
                <Text>{topic.name}</Text>
              </View>
              <View>
                <FollowButton topic={topic} />
              </View>
            </View>
          </View>)

        } else if (posts) {
          return (<View key={posts._id}>
            <View>
              <View>
                <Text>{posts.title}</Text>
              </View>
              <View>
                <FollowButton posts={posts} />
              </View>
            </View>
          </View>)
        } else if (people) {
          return (<View key={people._id}>
            <Image source={{uri: people.avatar_url}} style={{width:50,height:50}} />
            <View>
              <View>
                <Text>{people.nickname}</Text>
                <View styleName="people-status">
                  {people.posts_count ? <Text>帖子 {people.posts_count}</Text> : null}
                  {people.comment_count ? <Text>评论 {people.comment_count}</Text> : null}
                  {people.fans_count ? <Text>粉丝 {people.fans_count}</Text> : null}
                  {people.follow_people_count ? <Text>关注用户 {people.follow_people_count}</Text> : null}
                  {people.follow_posts_count ? <Text>关注帖子 {people.follow_posts_count}</Text> : null}
                  {people.follow_topic_count ? <Text>话题 {people.follow_topic_count}</Text> : null}
                </View>
              </View>
              <View>
                <FollowButton user={people} />
              </View>
            </View>
          </View>)
        }


      })}

    </ScrollView>)
  */
  }
}

/*
export default connect((state, props) => ({
    list: getFollowListByName(state, props.id)
  }),
  (dispatch) => ({
    load: bindActionCreators(findFollows, dispatch)
  })
)(CommentList)
*/
