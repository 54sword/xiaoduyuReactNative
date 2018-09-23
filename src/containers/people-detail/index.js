import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, TextInput, navigator, Dimensions, Alert } from 'react-native';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';

// package
import Lightbox from 'react-native-lightbox';
import Carousel from 'react-native-looped-carousel';

// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadPeopleList } from '../../actions/people';
import { addBlock, removeBlock } from '../../actions/block';
import { getPeopleById } from '../../reducers/people';
import { getProfile } from '../../reducers/user';

// components
import { ListItem } from '../../components/ui';
import FollowButton from '../../components/follow/button';
import Loading from '../../components/ui/loading';
import MenuIcon from '../../components/ui/icon/menu';
import Wait from '../../components/ui/wait';
import ReportMenu from '../../components/report-menu';
import Img from '../../components/image';

const S = global.styles;

const WINDOW_WIDTH = Dimensions.get('window').width;
const BASE_PADDING = 10;

import styles from './styles';


@connect(
  (state, props) => ({
    me: getProfile(state),
    people: getPeopleById(state, props.navigation.state.params.id)
  }),
  dispatch => ({
    removeBlock: bindActionCreators(removeBlock, dispatch),
    addBlock: bindActionCreators(addBlock, dispatch),
    loadPeopleList: bindActionCreators(loadPeopleList, dispatch)
  })
)
export default class PeopleDetail extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { people, headerRight } = navigation.state.params;

    let option = {
      // headerTitle: title
    }

    if (people) option.title = people.nickname;
    if (headerRight) option.headerRight = headerRight;

    return option
  }

  constructor (props) {
    super(props)
    this.state = {
      visibleWait: false
    }
    this.menu = this.menu.bind(this)
  }

  menu(key) {
    this.ActionSheet.show()
  }

  async componentDidMount() {

    const self = this
    const { id } = this.props.navigation.state.params
    let { loadPeopleList, me, people, navigation } = this.props

    if (!people) {
      let [ err, res ] = await loadPeopleList({
        name: id,
        filters: { query: { _id: id } }
      });
    }

    people = this.props.people;

    if (people && me && me._id == people._id || !people) return;

    this.props.navigation.setParams({
      people,
      headerRight: (<View style={{flexDirection:'row'}}>

        <View style={{marginRight:15}}>
          <ReportMenu people={people} navigation={navigation} />
        </View>

      </View>)
    });

  }

  render() {

    // const [ people ] = this.props.people
    const { navigate } = this.props.navigation;
    const { me, people } = this.props;

    // console.log(me);

    if (!people) return (<Loading />)

    let renderCarousel = null

    if (people.avatar_url) {

      renderCarousel = () => {
        return (
          <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Img image={'https:'+people.avatar_url.split('&')[0]} />
          </View>)
      }

    }

    // <Lightbox springConfig={{tension: 15, friction: 7}} swipeToDismiss={false} renderContent={renderCarousel}>
    
    return (<ScrollView>

      <View style={[styles.head, S['m-b-10'], S['m-t-10']]}>
        <View>
          {people.avatar_url ?
            <Lightbox navigator={this.props.navigator} renderContent={renderCarousel}>
              <Image source={{uri:'https:'+people.avatar_url}} style={styles.avatar} />
            </Lightbox> : null}
        </View>
        <View style={[S['f-d-r'], {flex:1,justifyContent:'space-between'}]}>
          <View>
            {people.nickname ? <Text style={styles.nickname}>{people.nickname}</Text> : null}
            <View style={styles.other}>
              {people.fans_count ? <Text style={styles.fans}>{people.fans_count} 粉丝</Text> : null}
              {people.follow_people_count ? <Text>{people.follow_people_count} 关注</Text> : null}
            </View>
            {people.brief ? <View><Text>{people.brief}</Text></View> : null}
          </View>
          {/*
          <View>
            <FollowButton user={people} />
          </View>
          */}
        </View>
        <View>
          <FollowButton user={people} buttonType="max-white" />
        </View>
      </View>

      <TouchableOpacity onPress={()=>{
        navigate('List',{
          componentName: 'PostsList',
          id: 'follow-'+people._id,
          filters: {
            query: {
              user_id: people._id,
              sort_by: 'create_at',
              deleted: false
            }
          },
          title: people.nickname + '的帖子',
          hideUserInfo: true
        })
        }}>
        <ListItem name={"他发布的帖子"} rightText={people.posts_count} />
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>{
        navigate('List', {
          componentName: 'CommentList',
          id: people._id,
          filters: {
            variables:{
              user_id: people._id,
              sort_by: 'create_at',
              parent_id:'not-exists',
              deleted: false
            }
          },
          canClick:false,
          title: people.nickname + '的评论'
        })
        }}>
        <ListItem name={"他的评论"} rightText={people.comment_count} />
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>{
        navigate('List', {
          componentName: 'FollowList',
          id: 'topic-'+people._id,
          args: {
            user_id: people._id,
            topic_id: 'exists',
            sort_by: 'create_at',
            deleted: false
          },
          fields: `
            topic_id {
              _id
              avatar
              name
              follow
              brief
            }
          `,
          title: people.nickname + '关注的话题'
        })
      }}>
        <ListItem name={"他的关注的话题"} rightText={people.follow_topic_count} />
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>{
        navigate('List', {
          componentName: 'FollowList',
          id: 'posts-'+people._id,
          args: {
            user_id: people._id,
            posts_id: 'exists',
            sort_by: 'create_at',
            deleted: false
          },
          fields:`
            posts_id {
              _id
              title
              follow
            }
          `,
          title: people.nickname + '关注的帖子'
        })
      }}>
        <ListItem name={"他关注的帖子"} rightText={people.follow_posts_count} />
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>{
        navigate('List', {
          componentName: 'FollowList',
          id: people._id + '-follow',
          args: {
            user_id: people._id,
            people_id: 'exists',
            sort_by: 'create_at',
            deleted: false
          },
          fields:`
            people_id {
              _id
              nickname
              create_at
              fans_count
              comment_count
              follow_people_count
              follow
              avatar_url
              brief
            }
          `,
          title: people.nickname + '关注的人'
        })
      }}>
        <ListItem name={"他关注的人"} rightText={people.follow_people_count} />
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>{
        navigate('List', {
          componentName: 'FollowList',
          id: people._id + '-fans',
          args:{
            people_id: people._id,
            sort_by: 'create_at',
            deleted: false
          },
          fields:`
            user_id {
              _id
              nickname
              create_at
              fans_count
              comment_count
              follow_people_count
              follow
              avatar_url
              brief
            }
          `,
          title: people.nickname + '的粉丝'
        })
      }}>
        <ListItem name={"他的粉丝"} rightText={people.fans_count} />
      </TouchableOpacity>

      {this.state.visibleWait ? <Wait /> : null}

    </ScrollView>)
  }
}

/*
export default connect((state, props) => ({
    me: getProfile(state),
    people: getPeopleById(state, props.navigation.state.params.id)
  }),
  (dispatch) => ({
    removeBlock: bindActionCreators(removeBlock, dispatch),
    addBlock: bindActionCreators(addBlock, dispatch),
    loadPeopleList: bindActionCreators(loadPeopleList, dispatch)
  })
)(PeopleDetail);
*/
