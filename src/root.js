import React, { Component } from 'react';
import { View, Text, Platform, StatusBar, YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import { ApolloProvider } from "react-apollo";
import * as WeChat from 'react-native-wechat';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';

import initGlobalParam from './global';
import getStore from './store/configure-store.js';
import { client } from './common/graphql';
import starSocket from './socket';
import Navigators from './navigators';
import * as JPush from './common/jpush';

import { wechat_appid } from '../config';
import NavigationService from './actions/navigation-service';

const store = getStore();

// 初始化全局的一些参数
initGlobalParam(store);

// 配置微信分享
WeChat.registerApp(wechat_appid);

// 添加通知监听器
// 注意：需要尽量早的启动，如果等待1、2秒才启动，会有可能获取不到点击事件
JPush.addListener();

export default class Root extends Component {

  componentDidMount() {
    // 启动websocket
    starSocket(store);
  }

  render() {

    return (<Provider store={store}>
      <ApolloProvider client={client}>
        <Navigators ref={ref => NavigationService.setTopLevelNavigator(ref)} />
      </ApolloProvider>
    </Provider>)

  }

}
