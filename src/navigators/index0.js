import React, { PureComponent } from 'react';
import { View, Text, Image, PixelRatio, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
// import Platform from 'Platform';
import { ifIphoneX } from 'react-native-iphone-x-helper';

// screen
// sign
//
// import FastSignIn from '../containers/fast-sign-in';
import SignIn from '../containers/sign-in';
import SignUp from '../containers/sign-up';
import OtherSignIn from '../containers/other-sign-in';
import Forgot from '../containers/forgot';

import Entrance from '../containers/entrance';
import Home from '../containers/home';
import Follow from '../containers/follow';
// import Topics from '../containers/topics'
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

// edit
import WritePosts from '../containers/write-posts';
import WriteComment from '../containers/write-comment';
import AddPosts from '../containers/add-posts';

let tabBarOptions = {
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
}

if (Platform.OS === 'android') {

  tabBarOptions = {
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

}

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
  swipeEnabled:false,
  animationEnabled:false,
  lazy: true,
  tabBarOptions
});

Main.navigationOptions = {
  header: null
  // tabBarComponent: (<View><Text>1111</Text></View>)
}

/*
Main.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];

  const { navigate } = navigation;

  let headerTitle = routeName;

  let routers = {
    'Home': {
      headerTitle: '小度鱼',

      headerLeft: (<TouchableOpacity onPress={()=>{
        navigate('Search')
      }}><Image
        source={require('./images/search.png')}
        style={{width:20,height:20,marginLeft:10,marginRight:10}}
      /></TouchableOpacity>),

      headerRight: global.signInStatus ? (<TouchableOpacity onPress={()=>{
        navigate('ChooseTopic')
      }}><Image
        source={require('./images/plus.png')}
        style={{width:20,height:20,marginLeft:10,marginRight:10}}
      /></TouchableOpacity>) : null
    },
    'Follow': {
      headerTitle: '关注'
    },
    'Notifications': {
      headerTitle: '通知'
    },
    'Me': {
      headerTitle: '我'
    }
  }

  let route = routers[routeName];

  let options = {
    headerStyle: {
      backgroundColor: '#24292e',
      borderBottomWidth: 0
    },
    headerTintColor: '#ffffff',
    headerTitleStyle: {
      fontSize: 17,
      color:'#ffffff'
    },
    headerBackTitleStyle: {
      backgroundColor: '#333'
    },
    headerBackTitleStyle: {
      fontSize:17
    }
  }

  Reflect.ownKeys(route).map(item=>{
    options[item] = route[item];
  });

  return options;
};
*/

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

})

const Sign = createStackNavigator({
  SignIn,
  SignUp,
  Forgot,
  // FastSignIn,
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

App.navigationOptions = {
  header: null
}

Sign.navigationOptions = {
  header: null
}


const RootStack = createStackNavigator(
  {
    App,
    Sign,

    UnlockToken,
    OtherSignIn,
    WriteComment,
    WritePosts,
    ChooseTopic
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

/*
RootStack.navigationOptions = ({ navigation }) => {

  console.log('11111');

  let { routeName } = navigation.state.routes[navigation.state.index];

  const { navigate } = navigation;

  let headerTitle = routeName;

  let routers = {
    'App': { head: null },
    'Sign': { head: null },
    'UnlockToken': { head: null },
    'OtherSignIn': { head: null },
    'WriteComment': { head: null }
  }

  let route = routers[routeName];

  let options = {
    headerStyle: {
      backgroundColor: '#323338',
      borderBottomWidth: 0
    },
    headerTintColor: '#ffffff',
    headerTitleStyle: {
      fontSize: 17,
      color:'#ffffff'
    },
    headerBackTitleStyle: {
      backgroundColor: '#333'
    },
    headerBackTitleStyle: {
      fontSize:17
    }
  }

  Reflect.ownKeys(route).map(item=>{
    options[item] = route[item];
  });

  return options;
};
*/

export default RootStack;
