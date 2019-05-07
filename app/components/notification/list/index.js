
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, refreshControl, TouchableOpacity, ActivityIndicator, RefreshControl, PixelRatio, FlatList } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// import Collapsible from 'react-native-collapsible-header';
// import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper';

import { loadNotifications } from '../../../store/actions/notification';
import { getNotificationListById } from '../../../store/reducers/notification'

import { DateDiff } from '../../../common/date'

// import CommentItem from '../../components/comment-item'
// import HTMLView from '../../../components/html-view'

import Loading from '../../../components/ui/loading'
import Nothing from '../../../components/nothing'
import ListFooter from '../../../components/ui/list-footer'
// import RefreshControl from '../../components/ui/refresh-control'
// import ListViewOnScroll from '../../common/list-view-onscroll'

import styles from './styles'

@connect(
  (state, props) => ({
    list: getNotificationListById(state, props.name)
  }),
  dispatch => ({
    loadNotifications: bindActionCreators(loadNotifications, dispatch)
  })
)
export default class NotificationList extends Component {

  constructor (props) {
    super(props)

    // var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      isRefreshing: false,
      // 打开阅读全部的id
      readAllId: []
    }

    this.loadList = this.loadList.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
    this.renderNotice = this.renderNotice.bind(this)
    this.toPeople = this.toPeople.bind(this)
    this.toPosts = this.toPosts.bind(this)
    this.toComment = this.toComment.bind(this)
    this.toReply = this.toReply.bind(this)
    this.onScroll = this.onScroll.bind(this)
    this.addReadAll = this.addReadAll.bind(this)
    this.renderHeader = this.renderHeader.bind(this)
    this.onRefresh = this.onRefresh.bind(this)
  }

  componentWillMount() {
    const { list } = this.props
    if (!list.data) this.loadList()
  }

  addReadAll(id) {
    let { readAllId } = this.state

    if (readAllId.indexOf(id) == -1) {
      readAllId.push(id)
      this.setState({ readAllId })
    }

  }

  toPeople(user) {
    const { navigate } = this.props.navigation;
    navigate('PeopleDetail', { id: user._id })
  }

  toPosts(posts) {
    const { navigate } = this.props.navigation;
    navigate('PostsDetail', { title: posts.title, id: posts._id })
  }

  toComment(comment) {
    const { navigate } = this.props.navigation;
    navigate('CommentDetail', { title: comment.content_trim, id: comment._id })
  }

  toReply(comment) {
    const { navigate } = this.props.navigation;
    navigate('WriteComment', {
      postsId: comment.posts_id._id,
      parentId: comment.parent_id ? comment.parent_id._id : null,
      replyId: comment._id
    })
  }

  async loadList(callback, restart) {
    const { name, filters } = this.props
    return await this.props.loadNotifications({ name, filters, callback, restart });
  }

  renderHeader() {

    const { renderHeader } = this.props;

    if (renderHeader) return renderHeader;

    return <View style={{marginTop:6}}></View>
  }

  async onScroll(event) {

    const { more } = this.props.list;

    if (!this.state.loading && more) {

      this.state.loading = true;
      await this.loadList();
      this.state.loading = false;
    }

  }

  onRefresh(toTop) {



    this.setState({ isRefreshing: true }, async ()=>{

      if (toTop && this.listRef) {
        // this.listRef.scrollToIndex({ viewPosition: 0, index: 0, animated: true });
        this.listRef && this.listRef.scrollToOffset({offset: -70, animated: true});
      }

      await this.loadList(()=>{}, true);
      this.setState({ isRefreshing: false });
    });

  }

  renderFooter() {
    const { list } = this.props

    if (list.loading) {
      return (<Loading />)
    } else if (!list.more) {
      return (
        <View>
          <Text>没有更多了</Text>
        </View>
      )
    }
  }

  renderNotice(notice) {



    const { readAllId } = this.state

    const avatar = (<TouchableOpacity onPress={()=>{this.toPeople(notice.sender_id)}} activeOpacity={0.8}>
      <Image source={{ uri: 'https:'+notice.sender_id.avatar_url }} style={styles.avatar} cache='force-cache' />
    </TouchableOpacity>)

    let content = null

    switch (notice.type) {

      case 'follow-you':
        content = (<TouchableOpacity style={styles.itemContent} onPress={()=>{this.toPeople(notice.sender_id)}}>
            <View style={styles.head}>
              <View style={styles.headLeft}>
                {avatar}
                <Text style={styles.nickname}>{notice.sender_id.nickname}</Text>
                <Text style={styles.gray}>关注了你</Text>
              </View>
              <View>
                <Text style={styles.createAt}>{DateDiff(notice.create_at)}</Text>
              </View>
            </View>
          </TouchableOpacity>)
        break

      case 'follow-posts':
        content = (<TouchableOpacity style={styles.itemContent}  onPress={()=>{this.toPosts(notice.posts_id)}}>
            <View style={styles.head}>
              <View style={styles.headLeft}>
                {avatar}
                <Text style={styles.nickname} onPress={()=>{this.toPeople(notice.sender_id)}}>{notice.sender_id.nickname}</Text>
              </View>
              <View>
                <Text style={styles.createAt}>{DateDiff(notice.create_at)}</Text>
              </View>
            </View>
            <Text style={styles.title}>
              <Text style={styles.gray}>收藏了你的</Text>
              <Text style={styles.black}> {notice.posts_id.title} </Text>
              <Text style={styles.gray}>帖子</Text>
            </Text>
          </TouchableOpacity>)
        break

      case 'like-posts':
        content = (<TouchableOpacity style={styles.itemContent} onPress={()=>{this.toPosts(notice.posts_id)}}>
            <View style={styles.head}>
              <View style={styles.headLeft}>
                {avatar}
                <Text style={styles.nickname} onPress={()=>{this.toPeople(notice.sender_id)}}>{notice.sender_id.nickname}</Text>
              </View>
              <View>
                <Text style={styles.createAt}>{DateDiff(notice.create_at)}</Text>
              </View>
            </View>
            <Text style={styles.title}>
              <Text style={styles.gray}>赞了你的</Text>
              <Text style={styles.black}> {notice.posts_id.title} </Text>
              <Text style={styles.gray}>帖子</Text>
            </Text>
          </TouchableOpacity>)
        break

      case 'reply':
        content = (<View>
          <TouchableOpacity style={styles.itemContent} onPress={()=>{this.toComment(notice.comment_id.parent_id)}}>
            <View style={styles.head}>
              <View style={styles.headLeft}>
                {avatar}
                <Text style={styles.nickname} onPress={()=>{this.toPeople(notice.sender_id)}}>{notice.sender_id.nickname}</Text>
              </View>
              <View>
                <Text style={styles.createAt}>{DateDiff(notice.create_at)}</Text>
              </View>
            </View>
            <Text style={styles.title}>
              <Text style={styles.gray}>回复了你的</Text>
              <Text style={styles.black}> {notice.comment_id.reply_id ? notice.comment_id.reply_id.content_trim : notice.comment_id.parent_id.content_trim} </Text>
              <Text style={styles.gray}>回复</Text>
            </Text>

            <View style={styles.commentContentText}>
              <Text style={styles.contentTrim}>{notice.comment_id.content_trim}</Text>
              {notice.comment_id.more ? <Text style={styles.readAll}>阅读全文</Text> : null}
            </View>

            {/*
            <TouchableOpacity onPress={()=>{this.addReadAll(notice._id)}} activeOpacity={0.8}>
              <View style={styles.commentContent}>

                {readAllId.indexOf(notice._id) != -1 ?
                  <HTMLView html={notice.comment_id.content_html} imgOffset={30} />:
                  <Text style={styles.commentContentText}>
                    {notice.comment_id.content_trim}
                    {notice.comment_id.more ? <Text style={styles.readAll}>阅读全文</Text> : null}
                  </Text>}

              </View>
            </TouchableOpacity>
            */}

          </TouchableOpacity>

          {/*
          <TouchableOpacity style={styles.replyView} onPress={()=>{this.toReply(notice.comment_id)}} activeOpacity={0.8}>
            <Text>回复</Text>
          </TouchableOpacity>
          */}

        </View>)
        break

      case 'comment':
        content = (<TouchableOpacity onPress={()=>{this.toComment(notice.comment_id)}}>

          <View style={styles.itemContent}>

            <View style={styles.head}>
              <View style={styles.headLeft}>
                {avatar}
                <Text style={styles.nickname} onPress={()=>{this.toPeople(notice.sender_id)}}>{notice.sender_id.nickname}</Text>
              </View>
              <View>
                <Text style={styles.createAt}>{DateDiff(notice.create_at)}</Text>
              </View>
            </View>

            <Text style={styles.title}>
              <Text style={styles.gray}>评论了你的</Text>
              <Text style={styles.black} onPress={()=>{this.toPosts(notice.comment_id.posts_id)}}> {notice.comment_id.posts_id.title} </Text>
              <Text style={styles.gray}>帖子</Text>
            </Text>

            <View style={styles.commentContentText}>
              <Text>{notice.comment_id.content_trim}</Text>
              {notice.comment_id.more ? <Text style={styles.readAll}>阅读全文</Text> : null}
            </View>

            {/*
            <TouchableOpacity onPress={()=>{this.addReadAll(notice._id)}} activeOpacity={0.8}>
              <View style={styles.commentContent}>

                {readAllId.indexOf(notice._id) != -1 ?
                  <HTMLView html={notice.comment_id.content_html} imgOffset={30} />:
                  <Text style={styles.commentContentText}>
                    {notice.comment_id.content_trim}
                    {notice.comment_id.more ? <Text style={styles.readAll}>阅读全文</Text> : null}
                  </Text>}

              </View>
            </TouchableOpacity>
            */}

          </View>

          {/*
          <TouchableOpacity style={styles.replyView} onPress={()=>{this.toReply(notice.comment_id)}} activeOpacity={0.8}>
            <Text>回复</Text>
          </TouchableOpacity>
          */}

        </TouchableOpacity>)
        break

      // 新的回答通知
      case 'new-comment':
        content = (
          <TouchableOpacity style={styles.itemContent} onPress={()=>{this.toComment(notice.comment_id)}}>
          <View style={styles.head}>
            <View style={styles.headLeft}>
              {avatar}
              <Text style={styles.nickname} onPress={()=>{this.toPeople(notice.sender_id)}}>{notice.sender_id.nickname}</Text>
            </View>
            <View>
              <Text style={styles.createAt}>{DateDiff(notice.create_at)}</Text>
            </View>
          </View>
          <Text style={styles.title}>
            <Text style={styles.gray}>评论了</Text>
            <Text style={styles.black} onPress={()=>{this.toPosts(notice.comment_id.posts_id)}}> {notice.comment_id.posts_id.title} </Text>
            <Text style={styles.gray}>帖子</Text>
          </Text>

          <View style={styles.commentContentText}>
            <Text>{notice.comment_id.content_trim}</Text>
            {notice.comment_id.more ? <Text style={styles.readAll}>阅读全文</Text> : null}
          </View>

          {/*
          <TouchableOpacity onPress={()=>{this.addReadAll(notice._id)}} activeOpacity={0.8}>

            {readAllId.indexOf(notice._id) != -1 ?
              <HTMLView html={notice.comment_id.content_html} imgOffset={30} />:
              <Text style={styles.commentContentText}>
                {notice.comment_id.content_trim}
                {notice.comment_id.more ? <Text style={styles.readAll}>阅读全文</Text> : null}
              </Text>}

          </TouchableOpacity>
          */}
        </TouchableOpacity>)
        break

      case 'like-reply':
        content = (
          <TouchableOpacity style={styles.itemContent} onPress={()=>{this.toComment(notice.comment_id.parent_id)}}>
            <View style={styles.head}>
              <View style={styles.headLeft}>
                {avatar}
                <Text style={styles.nickname}>{notice.sender_id.nickname}</Text>
              </View>
              <View>
                <Text style={styles.createAt}>{DateDiff(notice.create_at)}</Text>
              </View>
            </View>
            <Text style={styles.title}>
              <Text style={styles.gray}>赞了你的</Text>
              <Text style={styles.black}> {notice.comment_id.content_trim} </Text>
              <Text style={styles.gray}>回复</Text>
            </Text>
          </TouchableOpacity>
        )
        break

      case 'like-comment':
        content = (
        <TouchableOpacity style={styles.itemContent} onPress={()=>{this.toComment(notice.comment_id)}}>
          <View style={styles.head}>
            <View style={styles.headLeft}>
              {avatar}
              <Text style={styles.nickname} onPress={()=>{this.toPeople(notice.sender_id)}}>{notice.sender_id.nickname}</Text>
            </View>
            <View>
              <Text style={styles.createAt}>{DateDiff(notice.create_at)}</Text>
            </View>
          </View>
          <Text style={styles.title}>
            <Text style={styles.gray}>赞了你的</Text>
            <Text style={styles.black}> {notice.comment_id.content_trim} </Text>
            <Text style={styles.gray}>评论</Text>
          </Text>
        </TouchableOpacity>)
        break
    }

    if (content) {
      return (<View style={styles.item} key={notice._id}>{content}</View>)
    } else {
      return <View></View>
    }

  }

  render() {

    const self = this

    const { list, collapsible, headerBar, getRef = ()=>{} } = this.props

    // if (list.loading && list.data.length == 0 || !list.data) {
    //   return (<Loading />)
    // }

    let params = {
      _onRefresh: this.onRefresh,
      ref: c => {
        if (c) {
          getRef(c);
          this.listRef = c;
        }
      },
      keyExtractor: item => item._id,
      renderItem: ({item}) => this.renderNotice(item),
      data: list.data,
      ListHeaderComponent: this.renderHeader,
      ListFooterComponent:()=><ListFooter loading={list.loading} more={list.more} />,
      // ItemSeparatorComponent:()=><View style={{height:7}}></View>,
      ItemSeparatorComponent:()=><View style={{height:7,backgroundColor:'#f8f8f8'}}></View>,
      // ItemSeparatorComponent:()=><View style={{height:1/PixelRatio.get(),backgroundColor:'#cdced2',marginLeft:15,marginRight:15}}></View>,
      ListEmptyComponent:()=>{
        if (!list.loading && list.data && list.data.length == 0 && !list.data.more) {
          return <View style={{padding:30,alignItems:'center'}}><Text>没有数据</Text></View>
        } else {
          return null
        }
      },
      refreshing:list.loading,
      refreshControl:(
        <RefreshControl
          refreshing={this.state.isRefreshing}
          onRefresh={this.onRefresh.bind(this)}
          tintColor="#484848"
          title="加载中..."
          titleColor="#484848"
          colors={['#ff0000', '#00ff00', '#0000ff']}
          progressBackgroundColor="#ffffff"
        />
      ),
      onEndReached:this.onScroll,
      onEndReachedThreshold:0.1,
      initialNumToRender:5
    }

    /*
    if (collapsible) {

      let min = 0;

      if (global.OS == 'ios') {
        min = isIphoneX() ? 35 : 20;
      }

      return (
        <Collapsible
          max={45}
          min={min}
          backgroundColor={'#fff'}
          renderHeader={headerBar}
          flatList={true}
          {...params}
        />
      );
    }
    */

    return (
      <FlatList
        {...params}
        /*
        keyExtractor={item => item._id}
        renderItem={({item}) => this.renderNotice(item)}
        data={list.data}
        ListHeaderComponent={this.renderHeader}
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
            onRefresh={this.onRefresh.bind(this)}
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
        */
      />
    )

    /*
    return (
        <ListView
          enableEmptySections={true}
          dataSource={itemlist}
          renderRow={(item) => this.renderNotice(item)}
          renderHeader={this.renderHeader}
          renderFooter={()=><ListFooter loading={list.loading} more={list.more} />}
          // renderFooter={this.renderFooter}
          removeClippedSubviews={false}
          // refreshControl={<RefreshControl onRefresh={callback=>self.loadList(callback, true)} />}

          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefresh.bind(this)}
              tintColor="#484848"
              title="加载中..."
              titleColor="#484848"
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor="#ffffff"
            />
          }

          onScroll={this.onScroll}
          // onScroll={this._onScroll.bind(this)}
          scrollEventThrottle={50}
        />
    )
    */
  }

}
