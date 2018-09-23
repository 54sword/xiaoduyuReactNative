
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, Image, TouchableOpacity } from 'react-native'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ReportMenu from '../../report-menu';

// import NavigationService from '../../../actions/navigation-service';

// styles
import styles from './styles'

@connect(
  (state, props) => ({
  }),
  dispatch => ({
  })
)
export default class PostsListItem extends Component {

  static defaultProps = {
    // 显示用户信息
    hideUserInfo: false
  }

  static propTypes = {
    // 帖子对象
    posts: PropTypes.object.isRequired,
    // 导航
    navigation: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props);
    this.state = {};
    this.goPosts = this.goPosts.bind(this);
    this.toPeople = this.toPeople.bind(this);
  }

  toPeople(people) {

    // NavigationService.navigate('PeopleDetail', { title: people.nickname, id: people._id });

    // const { navigate } = this.props.navigation;
    const { push } = this.props.navigation;
    push('PeopleDetail', { title: people.nickname, id: people._id });
  }

  goPosts(posts){

    const { push } = this.props.navigation;
    push('PostsDetail', { title: posts.title, id: posts._id });

    // NavigationService.push('PostsDetail', { title: posts.title, id: posts._id });

    // console.log(this.props.navigation);

    // console.log(navigation);

    // const { navigate } = this.props.navigation;
    // console.log(navigate);
    // navigate.push('PostsDetail', { title: posts.title, id: posts._id });
  }

  render() {

    const self = this
    const { posts, hideUserInfo, navigation } = this.props;


    let imagesUrl = '';

    // if (posts.images && posts.images[0] && posts.content_html) {
      // imagesUrl = 'https:' + posts.images[0].split('?')[0] + '?imageMogr2/auto-orient/thumbnail/!400/format/jpg';
    // }

    // if (posts.content_summary && posts.content_summary.length > 100 && posts.coverImage) {
    if (posts.coverImage) {
      imagesUrl = 'https:' + posts.images[0].split('?')[0] + '?imageMogr2/auto-orient/thumbnail/!400/format/jpg';
    }

    return(<TouchableOpacity style={styles.postsItem} onPress={()=>{this.goPosts(posts)}} activeOpacity={0.6}>

            <View style={styles.itemHead}>

              {!hideUserInfo ?
                <View>
                  <TouchableOpacity onPress={()=>{this.toPeople(posts.user_id)}} activeOpacity={0.6}>
                    <Image
                      source={{uri:'https:'+posts.user_id.avatar_url}}
                      style={styles.avatar}
                      cache='force-cache'
                      />
                  </TouchableOpacity>
                </View>
                : null}

              <View style={{flex:1}}>
                {!hideUserInfo ?
                  <View>
                    <View><Text style={styles.nickname}>{posts.user_id.nickname}</Text></View>
                  </View>
                  : null}
                <View style={styles.itemHeadOther}>
                  <Text style={styles.itemHeadOtherItem}>{posts.topic_id.name}</Text>
                </View>
              </View>

              {/*
              <View>
                <ReportMenu posts={posts} navigation={navigation} />
              </View>
              */}

            </View>

            <View style={styles.itemMain}>
              <View style={{flex:1}}>
                <Text style={styles.title}>{posts.title}</Text>
                {posts.content_summary ? <Text style={styles.contentText}>{posts.content_summary}</Text> : null}
              </View>
              {imagesUrl ?
                <View>
                  <Image source={{uri:imagesUrl}} style={styles.images} resizeMode="cover" cache='force-cache' />
                </View>
                : null}
            </View>

            <View style={styles.postsInfo}>
              <View style={{flexDirection:'row',marginLeft:15}}>
                {posts.view_count ? <Text style={styles.itemHeadOtherItem}>{posts.view_count+' 阅读'}</Text> : null}
                {posts.comment_count ? <Text style={styles.itemHeadOtherItem}>{posts.comment_count+' 评论'}</Text> : null}
                {posts.like_count ? <Text style={styles.itemHeadOtherItem}>{posts.like_count+' 赞同'}</Text> : null}
                {posts.follow_count ? <Text style={styles.itemHeadOtherItem}>{posts.follow_count+' 关注'}</Text> : null}
              </View>
            </View>


    </TouchableOpacity>)
  }

}
