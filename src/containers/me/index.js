import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, ScrollView, Button, TouchableOpacity, AsyncStorage } from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getProfile } from '../../reducers/user'

import { ListItem } from '../../components/ui';
import NotSignIn from '../../components/not-sign-in';

import styles from './style'

class Me extends React.Component {

  static navigationOptions = {
    // tabBarLabel:'我',
    // header: null,
    title: '我',
    // tabBarLabel: (props) => {
    //   return (<View style={stylesIcon.tabBarLabel}>
    //     <View style={stylesIcon.tabBarLabelView}><Text>我的</Text></View>
    //     <View style={[stylesIcon.tabBarLabelLine, props.focused ? stylesIcon.focused : null ]}></View>
    //     </View>)
    // }
    tabBarIcon: ({ tintColor }) => (<Image source={require('./images/me.png')} style={[styles.icon, {tintColor: tintColor}]} />),
    tabBarOnPress: ({ navigation, defaultHandler }) => {
      // console.log(navigation);
      // console.log(defaultHandler);
      // navigation.navigate('Sign');

      if (global.signInStatus) {
        defaultHandler();
      } else {
        navigation.navigate('Sign', { routeName: 'Me' });
      }

      // defaultHandler();
    }
  }

  constructor (props) {
    super(props)
  }

  componentDidMount() {
    const { me } = this.props;
    const { navigate } = this.props.navigation;

    if (!global.signInStatus || me && me.phone) return;

    // 提示绑定手机
    AsyncStorage.getItem('binding-phone-tips', (errs, result)=>{
      result = null
      if (result && new Date().getTime() > parseInt(result)) {

        Alert.alert('绑定手机号', '亲爱的用户，应2017年10月1日起实施的《中华人民共和国网络安全法》要求，网站须强化用户实名认证机制。您需要验证手机方可使用社区功能，烦请您将账号与手机进行绑定。', [
          {
            text: '暂不',
            onPress: () => {
              AsyncStorage.setItem('binding-phone-tips', (new Date().getTime() + 1000 * 60 * 60 * 24 * 3) + '', ()=>{})
            }
          },
            {
              text: '去绑定',
              onPress: () => navigate('BindingPhone')
            }
          ]
        )
      } else if (!result) {
        AsyncStorage.setItem('binding-phone-tips', (new Date().getTime() + 1000 * 60 * 60 * 24 * 3) + '', ()=>{})
      }

    });

  }

  render() {

    const self = this;
    const { me, navigation } = this.props;
    const { navigate } = navigation;

    if (!me) return null;

    /*
    if (!me) {
      return (<NotSignIn
        text="您还没有登陆，无法个人信息"
        onPressSignUp={()=>{
          navigation.navigate('SignUp', { routeName: 'Me' });
        }}
        onPressSignIn={()=>{
          navigation.navigate('SignIn', { routeName: 'Me' });
        }}
        />);
    }
    */

    return (<ScrollView style={styles.container}>

          <View>
            {/*
            <View style={{height:20,backgroundColor:'#fff'}}></View>

            <View style={{
              padding:15,
              // borderBottomWidth:1/PixelRatio.get(),
              // borderColor:'#efefef',
              backgroundColor:'#fff'
            }}>
              <Text style={{fontSize:24, fontWeight:'bold', color:'#23232b'}}>我</Text>
            </View>
            */}

            <TouchableOpacity onPress={()=>{
              self.props.navigation.navigate('Setting');
            }}>

              <View style={styles.avatarItem}>

                <View>
                  {me ?
                    <Image source={{uri: me ?'https:'+me.avatar_url.split('?')[0]+'?imageMogr2/thumbnail/!200/quality/90' : ''}} style={styles.avatar} />
                    : <View style={styles.avatar}></View>}
                </View>

                {me.nickname ?
                  <View>
                    <Text style={styles.black}>{me.nickname}</Text>
                  </View>
                  : null}

                {me.birf ?
                  <View>
                    <Text style={styles.black}>{me.birf}</Text>
                  </View>
                  : null}

              </View>

            </TouchableOpacity>

            <View>




              <TouchableOpacity onPress={()=>{
                if (!me) return self.props.navigation.navigate('FastSignIn');
                navigate('List', { componentName: 'PostsList', id: me._id, filters: { query:{ user_id: me._id, sort_by: 'create_at' } }, title: me.nickname + '的帖子', hideUserInfo: true });
              }}>
                <ListItem name={"我创建的帖子"} rightText={me ? me.posts_count : ''} />
              </TouchableOpacity>

              {/*
              <TouchableOpacity onPress={()=>{
                if (!me) return self.props.navigation.navigate('FastSignIn');
                navigate('List', { componentName: 'CommentList', id: me._id + '-posts', filters: { query: { user_id: me._id, sort_by: 'create_at', parent_id:'exists' } }, title: me.nickname + '的评论' })
              }}>
                <ListItem name={"我编写的评论"} rightText={me ? me.follow_posts_count : ''} />
              </TouchableOpacity>
              */}

              <View style={styles.gap}></View>

              <TouchableOpacity onPress={()=>{
                navigate('List', {
                  componentName: 'FollowList',
                  id: me._id + '-fans',
                  args:{
                    people_id: me._id,
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
                  title: me.nickname + '的粉丝'
                })
              }}>
                <ListItem name={"我的粉丝"} rightText={me ? me.fans_count : ''} />
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>{
                if (!me) return self.props.navigation.navigate('FastSignIn');
                navigate('List', {
                  componentName: 'FollowList',
                  id: me._id + '-posts',
                  args: {
                    user_id: me._id,
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
                  title: me.nickname + '关注的帖子'
                })
              }}>
                <ListItem name={"我关注的帖子"} rightText={me ? me.comment_count : ''} />
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>{
                if (!me) return self.props.navigation.navigate('FastSignIn');
                navigate('List', {
                  componentName: 'FollowList',
                  id: me._id+'-topic',
                  args: {
                    user_id: me._id,
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
                    }
                  `,
                  title: me.nickname + '关注的话题'
                })
              }}>
                <ListItem name={"我关注的话题"} rightText={me ? me.follow_topic_count : ''} />
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>{
                navigate('List', {
                  componentName: 'FollowList',
                  id: me._id + '-follow',
                  args: {
                    user_id: me._id,
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
                  title: me.nickname + '关注的人'
                })
              }}>
                <ListItem name={"我关注的人"} rightText={me ? me.follow_people_count : ''} />
              </TouchableOpacity>

              {/*
              <TouchableOpacity onPress={()=>{
                this.props.navigation.navigate('PeopleDetail', { title: me.nickname, id: me._id });
              }}>
                <ListItem name={"个人主页"} />
              </TouchableOpacity>
              */}

              <View style={styles.gap}></View>

              <TouchableOpacity onPress={()=>{
                this.props.navigation.navigate('WritePosts', {
                  topic: {
                    _id: "58b7f69ee2c9ef85541619d5",
                    avatar: "//img.xiaoduyu.com/8c78a828-fbe6-4b22-91b3-e473343a4890.png?imageMogr2/crop/!300x300a0a0/thumbnail/!200",
                    name: "问题反馈"
                  },
                  useCache: false
                });
              }}>
                <ListItem name={"反馈和帮助"} />
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>{ this.props.navigation.navigate('Setting') }}>
                <ListItem name={"设置"} />
              </TouchableOpacity>

            </View>
          </View>

      </ScrollView>)
  }
}

export default connect(state => ({
    me: getProfile(state)
  }),
  (dispatch) => ({
  })
)(Me)
