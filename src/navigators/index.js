import React, { PureComponent } from 'react';
import { View, Text, Image, PixelRatio, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import { ifIphoneX } from 'react-native-iphone-x-helper';

// screens
import SignIn from '../containers/sign-in';
import SignUp from '../containers/sign-up';
import OtherSignIn from '../containers/other-sign-in';
import Forgot from '../containers/forgot';
import Entrance from '../containers/entrance';
import Home from '../containers/home';
import Follow from '../containers/follow';
import Notifications from '../containers/notifications';
import Me from '../containers/me';
import PostsDetail from '../containers/posts-detail';
import CommentDetail from '../containers/comment-detail';
import ChooseTopic from '../containers/choose-topic';
import Setting from '../containers/setting';
import TopicDetail from '../containers/topic-detail';
import PeopleDetail from '../containers/people-detail';
import List from '../containers/list';
import SocialAccount from '../containers/social-account';
import Agreement from '../containers/agreement';
import UnlockToken from '../containers/unlock-token';
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
import WritePosts from '../containers/write-posts';
import WriteComment from '../containers/write-comment';
import AddPosts from '../containers/add-posts';


const Main = createBottomTabNavigator({
  Home,
  Follow,
  AddPosts,
  Notifications,
  Me
},
{
  initialRouteName: 'Home',
  tabBarPosition: 'bottom',
  swipeEnabled: false,
  animationEnabled: false,
  lazy: true,
  tabBarOptions: Platform.select({
    ios: {
      style: {
        borderTopWidth: 0,
        backgroundColor:'#fff',
        ...ifIphoneX({
          height: 35
          // paddingBottom: 15
        })
      },
      tabStyle: {
        borderTopWidth: 1/PixelRatio.get(),
        borderColor: '#e2e2e2',

        ...ifIphoneX({
          height: 50
        })

        // shadowOffset: { width: 10, height: 10 },
        // shadowRadius:30,
        // shadowOpacity:0.03,
        // zIndex:99

      },
      activeTintColor:'#3a63df',
      inactiveTintColor:'#81848b',
      labelStyle:{ fontSize: 10, paddingBottom:3 },
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
      activeTintColor:'#08f',
      inactiveTintColor:'#757575',

      showIcon: true,
      showLabel: true,
      // iconStyle: { backgroundColor:'#000' },
      labelStyle:{ fontSize: 10,marginTop:-7,paddingBottom:3 }
      // indicatorStyle: { backgroundColor: '#efefef' }
    }
  })
});

Main.navigationOptions = {
  header: null
}

Entrance.navigationOptions = {
  header: null
}

const App = createStackNavigator({
  Entrance,
  Main,
  PostsDetail,
  CommentDetail,
  Setting,
  PeopleDetail,
  List,
  ResetGender,
  ResetEmail,
  ResetAvatar,
  ResetNickname,
  ResetBiref,
  ResetPassword,
  SocialAccount,
  ResetPhone,
  Report,
  Block,
  TopicDetail,
  Search
  // ChooseTopic
},{
  initialRouteName: 'Entrance',
  // headerMode: 'float',
  // headerMode: 'none',
  // mode: 'modal',
  // headerTransitionPreset: 'fade-in-place',
  // body 部分的样式
  cardStyle: {
    backgroundColor:'#e7e9ec'
  },
  // header 导航
  navigationOptions: {
    // headerBackground: '#333',
    // headerTruncatedBackTitle: '返回',
    // headerBackTitle: null,
    headerStyle: {
      elevation: 0,
      backgroundColor: '#fff',
      // borderWidth:0,
      // shadowOpacity:0,
      borderBottomWidth: 0,

      height: Platform.OS === 'android' ? 45 : 45,

      ...ifIphoneX({
        height: 35,
        // marginTop:0,
        paddingBottom:10
      })

      // borderBottomWidth:1,
      // borderColor:'#fff',
      /*
      ...ifIphoneX({
        paddingTop:30,
        height: 75
        // borderBottomWidth:1
        // borderColor: '#e3e3e3'
      }, {
        height: Platform.OS === 'android' ? 50 : 50
      })
      */
    },
    headerTintColor: '#333',
    headerTitleStyle: {
      fontSize: 15,
      color:'#333'
    },
    headerBackTitleStyle: {
      backgroundColor: '#333'
    },
    headerBackTitleStyle: {
      fontSize:15
    },
    headerTruncatedBackTitle: '返回',
    headerBackImage: <View style={{ padding:15, paddingLeft:10, paddingRight:10, paddingBottom:12, paddingTop:12 }}><Image source={require('./images/back.png')} style={{ width:20,height:20 }} /></View>
  }

});

App.navigationOptions = {
  header: null
}

const Sign = createStackNavigator({
  SignIn,
  SignUp,
  Forgot,
  Agreement
},
{
  initialRouteName: 'SignIn',
  navigationOptions: {
    headerBackImage: <View style={{ padding:15, paddingLeft:10, paddingRight:10, paddingBottom:12, paddingTop:12 }}><Image source={require('./images/back.png')} style={{ width:20,height:20 }} /></View>,
    headerStyle: {
      elevation: 0
    }
  }
});

Sign.navigationOptions = {
  header: null
}

const RootStack = createStackNavigator(
  {
    App: { screen: App },
    Sign: { screen: Sign },
    UnlockToken: { screen: UnlockToken },
    OtherSignIn: { screen: OtherSignIn },
    WriteComment: { screen: WriteComment },
    WritePosts: { screen: WritePosts },
    ChooseTopic: { screen: ChooseTopic }
  },
  {
    mode: 'modal',
    // headerMode: 'none',
    initialRouteName: 'App',
    navigationOptions: {
      // 关闭手势
      gesturesEnabled: false
    }
  }
);

export default RootStack;
