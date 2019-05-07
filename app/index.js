import React, { useEffect } from 'react';
// import { StatusBar, YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import { ApolloProvider } from "react-apollo";
import Navigators from './navigators';
import * as WeChat from 'react-native-wechat';
import { TopView } from 'teaset';

import initGlobalParam from './global';
import createStore from './store/index.js';
import { client } from './common/graphql';

import * as Push from './common/aliyun-push';

import { wechatAppid } from '../config';
import NavigationService from './navigators/service';


export default () => {

  // 添加通知监听器
  Push.addListener();

  const store = createStore({});

    // 初始化全局的一些参数
  initGlobalParam(store);

  // 配置微信分享
  WeChat.registerApp(wechatAppid);

  useEffect(() => {
    return () => {
      Push.removeListener();
    };
  });

  return (
    <Provider store={store}>
      <TopView>
        <ApolloProvider client={client}>
          <Navigators
            ref={ref => NavigationService.setTopLevelNavigator(ref)}
            onNavigationStateChange={NavigationService.onNavigationStateChange}
            // uriPrefix="/app"
          />
        </ApolloProvider>
      </TopView>
    </Provider>
  )
}