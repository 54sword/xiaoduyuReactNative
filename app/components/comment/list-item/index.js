import React from 'react';
import { View, Text, Image, StyleSheet, Alert, TouchableOpacity, PixelRatio } from 'react-native';
// import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadCommentList } from '../../../store/actions/comment';
import { like, unlike } from '../../../store/actions/like';
import { getProfile } from '../../../store/reducers/user';

// components
import HtmlView from '../../html-view';
import LinkeButton from '../../like-button'
import ReportMenu from '../../report-menu';
// import CommentEditModal from '../../comment-edit-modal';

import LikeIcon from '../../ui/icon/like';



import styles from './styles';

@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
    loadCommentList: bindActionCreators(loadCommentList, dispatch),
    handleLike: bindActionCreators(like, dispatch),
    handleUnlike: bindActionCreators(unlike, dispatch)
  })
)
export default class CommentItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      expandList: []
    }
    this.toPeople = this.toPeople.bind(this);
    this.expand = this.expand.bind(this);
  }

  // 展开评论
  expand(id) {

    let { expandList } = this.state;
    let index = expandList.indexOf(id);

    if (index == -1) {
      expandList.push(id)
    } else {
      expandList.splice(index, 1);
    }

    this.setState({ expandList });

  }

  toPeople(people) {
    const { push } = this.props.navigation;
    push('PeopleDetail', { title: people.nickname, id: people._id })
  }

  render() {

    const S = global.styles;

    const self = this;
    const { expandList } = this.state;
    const {
      comment,
      displayLike = false,
      displayReply = false,
      subitem = false,
      displayCreateAt = false,
      displayEdit = true,
      canClick = true,
      me,
      navigation,
      onlyDisplayComment
    } = this.props;
    const { navigate } = this.props.navigation;

    let params = {
      id: comment._id,
      posts_id: comment.posts_id._id || comment.posts_id
    }

    params.parent_id = comment.parent_id || comment._id;
    params.reply_id = comment._id;

    // , subitem ? { borderTopWidth:0 } : null
    let main = (<View style={[styles.item]}>

      <View style={[styles.head, subitem ? styles.subitem : null]}>

          <View>
            <TouchableOpacity onPress={()=>{ this.toPeople(comment.user_id) }} activeOpacity={1}>
              <Image source={{uri:'https:'+comment.user_id.avatar_url}} style={styles.avatar} />
            </TouchableOpacity>
          </View>

        <View style={{flex:1,justifyContent:'center'}}>

            <View style={styles.nicknameView}>
              <Text style={styles.nickname} onPress={()=>{this.toPeople(comment.user_id)}}>{comment.user_id.nickname}</Text>
            </View>

          <View style={[S['f-d-r'],{marginTop:3}]}>

            <Text style={[S['m-r-5'], S['f-s-11'], S['black-50']]}>{comment._create_at}</Text>

            {comment.reply_id ?
              <Text style={[S['m-r-5'], S['f-s-11'], S['black-50']]} onPress={()=>{this.toPeople(comment.reply_id.user_id)}}>回复了 {comment.reply_id.user_id.nickname}</Text>
              : null}

            {/*
            {displayCreateAt ? <Text style={[S['m-r-5'], S['f-s-12'], S['black-30']]}>{comment._create_at}</Text> : null}
            {comment.reply_count ? <Text style={[S['m-r-5'], S['f-s-12'], S['black-30']]}>{comment.reply_count + '个回复'}</Text> : null}
            {comment.like_count ? <Text style={[S['m-r-5'], S['f-s-12'], S['black-30']]}>{comment.like_count + '个赞'}</Text> : null}
            */}
          </View>

        </View>


        <View style={{flexDirection:'row'}}>
          {/*
          <View style={{marginRight:20}}>


          <LinkeButton
            comment={comment}
            buttonType="min-gray"
            iconStyle={{width:14,height:14,tintColor:'#7f7f7f'}}
            />
          </View>

          {me ?
            <TouchableOpacity
              style={{marginRight:20,flexDirection:'row'}}
              onPress={()=>{
                navigate('WriteComment', {
                  posts_id: typeof comment.posts_id == 'string' ? comment.posts_id : comment.posts_id._id,
                  parent_id: comment.parent_id || comment._id,
                  reply_id: comment._id
                });
              }}>
              <Image source={require('./images/reply1.png')} style={{width:14,height:14, tintColor:'#7f7f7f', marginRight:5 }} />
              <Text style={{fontSize:12,color:'#7f7f7f'}}>回复</Text>
            </TouchableOpacity>
            : null}
          */}

          {/*
          <CommentEditModal navigation={navigation} {...params}>
            <View style={{flexDirection:'row'}}><Image source={require('./images/reply.png')} style={{width:16,height:16,marginRight:10}} /></View>
          </CommentEditModal>
          */}

          <View>
            <ReportMenu
            comment={comment}
            navigation={navigation}
            buttonStyle={{
              padding:10,
              paddingRight:15,
              marginTop:-10
            }}
            />
          </View>

        </View>


      </View>

      {/* 评论内容 */}
      <View style={[styles.main, subitem ? styles.subitem : null]}>

        {/*comment.content_summary && expandList.indexOf(comment._id) == -1 ?
          <Text onPress={()=>{ self.expand(comment._id); }} style={styles.contentText}>
            {comment.content_summary}
            <Text style={{color:'rgb(18, 133, 240)', fontSize: 14}}>{expandList.indexOf(comment._id) != -1 ? ' 收起' : ' 阅读全文'}</Text>
          </Text>
          : <HtmlView html={comment.content_html} imgOffset={subitem ? 75 : 30} fontSize={14} />*/}

        <HtmlView html={comment.content_html} imgOffset={subitem ? 75 : 30} fontSize={14} />

        {/*comment.content_summary && expandList.indexOf(comment._id) != -1 ?
          <Text onPress={()=>{ self.expand(comment._id); }} style={{color:'rgb(18, 133, 240)', marginTop:5, fontSize: 14}}>收起</Text>
        : null*/}

        {!comment.like_count ? null :
          <View style={{ marginTop:5, flexDirection:'row' }}>
            <LikeIcon
              style={{
                marginRight:5,
                width:13,
                height:13,
                tintColor: 'rgb(135, 136, 143)'
              }}
              />
            <Text style={{fontSize:12, color:'rgb(135, 136, 143)'}}>{comment.like_count} 赞同</Text>
          </View>}

      </View>




      {/*
      <View style={[styles.actions, subitem ? styles.subitem : null]}>

        <View style={{flexDirection:'row'}}>

          <LinkeButton
            comment={comment}
            buttonType="min-gray"
            />

          <CommentEditModal navigation={navigation} {...params}>
            <View style={{flexDirection:'row'}}><Image source={require('./images/reply.png')} style={{width:16,height:16,marginRight:10}} /></View>
          </CommentEditModal>

        </View>

        <View>
          <ReportMenu comment={comment} navigation={navigation} />
        </View>

      </View>
      */}

    </View>)


    if (onlyDisplayComment) {
      // , subitem ? { borderTopWidth:0 } : null
      main = (<View style={[styles.item]}>

        <View style={[styles.head, subitem ? styles.subitem : null]}>

          <View style={{marginBottom:5,flex:1}}>
            <Text
              style={[S['m-r-5'], S['f-s-13'], S['black-50'], {lineHeight:18}]}
              onPress={()=>{
                navigation.push('PostsDetail', {
                  id: comment.posts_id._id,
                  title: comment.posts_id.title
                });
              }}
              >{comment.posts_id.title}</Text>
          </View>

          <View style={{flexDirection:'row',marginRight:10}}>
            <Text style={[S['m-r-5'], S['f-s-11'], S['black-50']]}>{comment._create_at}</Text>
          </View>

        </View>

        {/* 评论内容 */}
        <View style={[styles.main, subitem ? styles.subitem : null]}>

          {comment.content_summary && expandList.indexOf(comment._id) == -1 ?
            <Text onPress={()=>{ self.expand(comment._id); }} style={styles.contentText}>
              {comment.content_summary}
              <Text style={{color:'rgb(18, 133, 240)', fontSize: 14}}>{expandList.indexOf(comment._id) != -1 ? ' 收起' : ' 阅读全文'}</Text>
            </Text>
            : <HtmlView html={comment.content_html} imgOffset={subitem ? 75 : 30} fontSize={14} />}

          {comment.content_summary && expandList.indexOf(comment._id) != -1 ?
            <Text onPress={()=>{ self.expand(comment._id); }} style={{color:'rgb(18, 133, 240)', marginTop:5, fontSize: 14}}>收起</Text>
            : null}

        </View>

      </View>)

    }

    return main;
  }
}
