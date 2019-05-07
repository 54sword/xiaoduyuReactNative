import React from 'react';
import { PixelRatio, Platform } from 'react-native';
import { createBottomTabNavigator, createStackNavigator, createAppContainer } from 'react-navigation';

import Entrance from '../containers/entrance';

import SignIn from '../containers/sign-in';
import SignUp from '../containers/sign-up';
import Forgot from '../containers/forgot';
import Agreement from '../containers/agreement';
import OtherSignIn from '../containers/other-sign-in';
import UnlockToken from '../containers/unlock-token';
import WriteComment from '../containers/write-comment';
import WritePosts from '../containers/write-posts';
import ChooseTopic from '../containers/choose-topic';
import Home from '../containers/home';
import Sessions from '../containers/sessions';
import sessionsDetail from '../containers/session-detail';
import writeMessage from '../containers/write-message';
import Notifications from '../containers/notifications';
import Me from '../containers/me';
import PostsDetail from '../containers/posts-detail';
import CommentDetail from '../containers/comment-detail';
import AccountAndSecurity from '../containers/account-and-security';
import UserInfoSettings from '../containers/userinfo-settings';
import Setting from '../containers/setting';
import TopicDetail from '../containers/topic-detail';
import PeopleDetail from '../containers/people-detail';
import List from '../containers/list';
import SocialAccount from '../containers/social-account';
import ResetNickname from '../containers/setings/nickname';
import ResetBiref from '../containers/setings/brief';
import ResetGender from '../containers/setings/gender';
import ResetPassword from '../containers/setings/password';
import ResetEmail from '../containers/setings/email';
import ResetAvatar from '../containers/setings/avatar';
import ResetPhone from '../containers/setings/phone';
import Report from '../containers/report';
import Block from '../containers/block';
import Search from '../containers/search';
import BindingPhone from '../containers/binding-phone';

// app 进入后的首页  
const Index = createBottomTabNavigator({
  Home,
  Notifications,
  Sessions,
  Me
},
{
  initialRouteName: 'Home',
  tabBarPosition: 'bottom',
  swipeEnabled: false,
  animationEnabled: false,
  lazy: true,
  navigationOptions: {
    // 去掉头部标题栏
    header: null
  },
  tabBarOptions: Platform.select({
    ios: {
      style: {
        borderTopWidth: 1/PixelRatio.get(),
        borderTopColor: '#e9edf0',
        backgroundColor:'#fff',
      },
      showLabel: true,
      // tabStyle: {},
      activeTintColor:'#1177fa',
      inactiveTintColor:'#5e6472',
      labelStyle:{ fontWeight:'bold', fontSize: 10, paddingBottom:0 },
    },
    android: {
      style: {
        height: 50,
        backgroundColor:'#fff',
        borderTopWidth: 0,
        padding:0,
        margin:0,
      },
      tabStyle:{
        borderTopWidth: 1/PixelRatio.get(),
        borderColor: '#e2e2e2'
      },
      activeTintColor:'#1177fa',
      inactiveTintColor:'#5e6472',

      showIcon: true,
      showLabel: true,
      // iconStyle: { backgroundColor:'#000' },
      labelStyle:{ fontSize: 10,marginTop:-7,paddingBottom:3 }
      // indicatorStyle: { backgroundColor: '#efefef' }
    }
  })
});

const createScreen = (screen) => {
  return {
    screen,
    navigationOptions: () => ({
      headerTintColor: '#484848',
      headerBackTitle: null,
      headerStyle:{
        borderBottomWidth: 1/PixelRatio.get(),
        borderBottomColor: 'rgb(233,237,240)'
      }
    })
  }
}


const App = createStackNavigator({
  Index: createScreen(Index),
  PostsDetail: createScreen(PostsDetail),
  CommentDetail: createScreen(CommentDetail),
  Setting: createScreen(Setting),
  PeopleDetail: createScreen(PeopleDetail),
  List: createScreen(List),
  ResetGender: createScreen(ResetGender),
  ResetEmail: createScreen(ResetEmail),
  ResetAvatar: createScreen(ResetAvatar),
  ResetNickname: createScreen(ResetNickname),
  ResetBiref: createScreen(ResetBiref),
  ResetPassword: createScreen(ResetPassword),
  SocialAccount: createScreen(SocialAccount),
  ResetPhone: createScreen(ResetPhone),
  Report: createScreen(Report),
  Block: createScreen(Block),
  TopicDetail: createScreen(TopicDetail),
  Search: createScreen(Search),
  sessionsDetail: createScreen(sessionsDetail),
  UserInfoSettings: createScreen(UserInfoSettings),
  AccountAndSecurity: createScreen(AccountAndSecurity)
},{
  initialRouteName: 'Index',

  // body 部分的样式
  cardStyle: {
    backgroundColor: '#fff'
  },
  
  // header 导航
  navigationOptions: {
    header: null
  }
});

const Sign = createStackNavigator({
  SignIn: createScreen(SignIn),
  SignUp: createScreen(SignUp),
  Forgot: createScreen(Forgot),
  Agreement: createScreen(Agreement)
},
{
  initialRouteName: 'SignIn',
  navigationOptions: {
    header: null
  }
});

const AppNavigator = createStackNavigator(
  {
    // 启动入口
    Entrance: { screen: Entrance },
    App: { screen: App },
    Sign: { screen: Sign },
    UnlockToken: { screen: UnlockToken },
    OtherSignIn: { screen: OtherSignIn },
    WriteComment: { screen: WriteComment },
    WritePosts: { screen: WritePosts },
    ChooseTopic: { screen: ChooseTopic },
    writeMessage: { screen: writeMessage },
    BindingPhone: { screen: BindingPhone }
  },
  {
    mode: 'modal',
    // headerMode: 'none',
    initialRouteName: 'Entrance',
    navigationOptions: {
      // 关闭手势
      gesturesEnabled: false
    }
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
