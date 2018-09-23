import React, { Component } from 'react';
import { Text, View, Image, Button, TouchableOpacity, PixelRatio } from 'react-native';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadCommentList } from '../../actions/comment';
import { getCommentListById } from '../../reducers/comment';
import { getProfile } from '../../reducers/user';

// components
import LikeButton from '../../components/like-button';
import ReportMenu from '../../components/report-menu';
import HTMLView from '../../components/html-view';
import CommentList from '../../components/comment/list';
import CommentListItem from '../../components/comment/list-item';
import Loading from '../../components/ui/loading';
import Nothing from '../../components/nothing';

// styles
import styles from './styles';

@connect(
  (state, props) => {
    const id = props.navigation.state.params.id
    return {
      commentList: getCommentListById(state, 'detail_'+id),
      me: getProfile(state)
    }
  },
  dispatch => ({
    loadCommentList: bindActionCreators(loadCommentList, dispatch)
  })
)
export default class CommentDetail extends Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    let option = {
      // headerTitle: params.title
    }

    // if (params.menu) option.headerRight = params.menu;
    return option;
  }

  constructor (props) {
    super(props)
    this.state = {
      nothing: false
    }
    this.toPeople = this.toPeople.bind(this);
  }

  async componentWillMount() {

    const self = this;
    const { loadCommentList, commentList, me, navigation } = this.props;
    const id = navigation.state.params.id;

    let comment = null;

    if (!commentList || !commentList.data || !commentList.data[0]) {

      let [ err, res ] = await loadCommentList({
        name: 'detail_'+id,
        filters: {
          variables: { _id: id, deleted: false, weaken: false }
        }
      });

      if (err || !res || !res.data[0]) {
        this.setState({ nothing: true });
        return;
      }

      comment = res.data[0];

    } else {
      comment = commentList.data[0];
    }

    /*
    this.props.navigation.setParams({
      menu: (<View style={{flexDirection:'row'}}>

        <LikeButton
          comment={comment}
          buttonType="max-white"
          onFinish={()=>{
            self.componentWillMount();
          }}
          />

        <ReportMenu
          comment={comment}
          navigation={navigation}
          buttonType="white"
          />

      </View>)
    });
    */

  }

  toPeople(user) {
    const { navigate } = this.props.navigation;
    navigate('PeopleDetail', { title: user.nickname, id: user._id })
  }

  render() {

    const { nothing } = this.state;
    const { me, commentList, navigation } = this.props;
    const { loading, data } = commentList;
    const { navigate } = this.props.navigation;

    let comment = data && data[0] ? data[0] : null;

    if (nothing || !comment) return (<Nothing content="评论不存在或已删除" />);
    if (!data || loading) return <Loading />;

    return (<View style={styles.container}>

          <CommentList
            navigation={navigation}
            name={comment._id}
            filters={{
              query: { parent_id: comment._id, page_size: 100 }
            }}
            displayLike={true}
            displayReply={true}
            displayCreateAt={true}
            renderHeader={()=>{
              return (<View style={styles.main}>

                      <TouchableOpacity style={styles.postsTitle} onPress={()=>{
                        navigate('PostsDetail', { title: comment.posts_id.title, id: comment.posts_id._id });
                      }}>
                        <Text style={styles.postsTitleText}>{comment.posts_id.title}</Text>
                      </TouchableOpacity>

                      <CommentListItem {...this.props} comment={comment} />

                      {/*
                      <View style={styles.itemHead}>
                        <View>
                          <TouchableOpacity onPress={()=>{ this.toPeople(comment.user_id) }}>
                            <Image source={{uri:'https:'+comment.user_id.avatar_url}} style={styles.avatar}  />
                          </TouchableOpacity>
                        </View>
                        <View>
                          <TouchableOpacity onPress={()=>{ this.toPeople(comment.user_id) }}>
                            <Text>{comment.user_id.nickname}</Text>
                          </TouchableOpacity>
                          <View>
                            <Text>{comment._create_at}</Text>
                          </View>
                        </View>
                        <View>

                        <ReportMenu
                          comment={comment}
                          navigation={navigation}
                          buttonType="white"
                          />

                        </View>
                      </View>

                      <View style={styles.comment}>
                        <HTMLView html={comment.content_html} />
                      </View>
                      */}

                    </View>)
            }}
            />

          <TouchableOpacity
            onPress={()=>{

              let writeComment = () => {
                navigate('WriteComment', {
                  posts_id: comment.posts_id._id,
                  parent_id: comment.parent_id || comment._id,
                  reply_id: comment._id
                });
              }

              if (me) {
                writeComment();
              } else {
                navigate('SignIn', {
                  routeName: 'CommentDetail',
                  setParams: {
                    title: comment.content_trim,
                    id: comment._id
                  },
                  onSignInFinish: () => {
                    writeComment();
                  }
                });
              }

            }}
            style={styles.bottomBar}>
            <Text style={{color:'#rgb(168, 168, 168)'}}>回复 {comment.user_id.nickname}</Text>
          </TouchableOpacity>

      </View>)
  }
};
