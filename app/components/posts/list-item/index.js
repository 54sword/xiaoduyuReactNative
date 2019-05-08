
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, Image, TouchableOpacity, TouchableHighlight } from 'react-native';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import navigationService from '../../../navigators/service';

// styles
import styles from './styles'


@connect(
  (state, props) => ({
  }),
  dispatch => ({
  })
)
export default class PostsListItem extends Component {

  static propTypes = {
    // 帖子对象
    posts: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props);
    this.state = {};
    this.goPosts = this.goPosts.bind(this);
    this.toPeople = this.toPeople.bind(this);
  }

  toPeople() {
    const { user_id } = this.props.posts;
    navigationService.navigate('PeopleDetail', { title: user_id.nickname, id: user_id._id });
  }

  goPosts(){
    const { posts } = this.props;
    navigationService.navigate('PostsDetail', { title: posts.title, id: posts._id });
  }

  render() {

    const { posts } = this.props;

    let imagesUrl = '';

    if (posts.images && posts.images[0]) {
      imagesUrl = 'https:' + posts.images[0].split('?')[0] + '?imageMogr2/auto-orient/thumbnail/!400/format/jpg';
    }

    return(<TouchableHighlight style={styles.item} onPress={this.goPosts} underlayColor="#eaedf0">
      
      <View>
      
      <View style={styles.headbar}>
        <View style={{flexDirection:'row',alignItems:'center'}}>
          <TouchableOpacity onPress={this.toPeople} activeOpacity={0.5}>
            <Image style={styles.avatar} source={{uri:'https:'+posts.user_id.avatar_url}} cache='force-cache' />
          </TouchableOpacity>
          <View>
            <Text style={styles.nickname} onPress={this.toPeople}>
              {posts.user_id.nickname}
            </Text>
            <Text style={styles.create_at}>{posts._create_at}</Text>
          </View>
        </View>
        <View>
          <TouchableOpacity style={styles.topicName} onPress={()=>{ navigationService.navigate('TopicDetail', { id: posts.topic_id._id }); }}>
            <Text style={styles.topicNameText}>{posts.topic_id.name}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.body}>
        <View style={{flex:1}}>
          <Text style={styles.title}>{posts.title}</Text>
          {posts.content_summary ?
            <View style={styles.contentSummary}><Text style={styles.contentText}>{posts.content_summary}</Text></View>
            : null}
        </View>
        {posts.content_summary && imagesUrl ?
          <View>
            <Image source={{uri:imagesUrl}} style={styles.images} resizeMode="cover" cache='force-cache' />
          </View>
          : null}
      </View>

      <View style={styles.footer}>
        
        {posts.view_count ?
            <Text style={styles.footerText}>{posts.view_count+' 阅读'}</Text>
          : null}

        {posts.comment_count ?
          <>
            <View style={styles.point}></View>
            <Text style={styles.footerText}>{posts.comment_count+' 评论'}</Text>
          </>
          : null}

        {posts.reply_count ?
          <>
            <View style={styles.point}></View>
            <Text style={styles.footerText}>{posts.reply_count+' 回复'}</Text>
          </>
          : null}
        
        {posts.like_count ?
          <>
            <View style={styles.point}></View>
            <Text style={styles.footerText}>{posts.like_count+' 赞'}</Text>
          </>
          : null}

        {posts.follow_count ?
          <>
            <View style={styles.point}></View>
            <Text style={styles.footerText}>{posts.follow_count+' 收藏'}</Text>
          </>
          : null}

      </View>
      </View>
    </TouchableHighlight>)
  }

}
