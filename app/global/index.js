
import React from 'react';
import { Platform } from 'react-native';
import Dimensions from 'Dimensions';
import NetInfo from "@react-native-community/netinfo";

import * as socket from '../socket';

import AsyncStorage from '@react-native-community/async-storage';

// tools
import To from '../common/to';
import * as AliyunPush from '../common/aliyun-push';

// redux
import navigationService from '../navigators/service';
import { loadUserInfo, addAccessToken } from '../store/actions/user';
import { exchangeNewToken } from '../store/actions/token';
import { removeUnlockToken } from '../store/actions/unlock-token';

// styles
import styles from '../styles';

// console.log(styles);

// import { debug } from '../config';

// global.debug = debug;
global.styles = styles;
global.OS = Platform.OS;

// 登陆状态
global.signInStatus = false;

global.screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
}

// console.log(global);

export default ({ dispatch, getState }) => {

  const handleActions = (fn, parameter) => {
    return fn(parameter)(dispatch, getState);
  }

  // 通过 accessToken 获取个人资料，以验证 token 是否有效
  const checkAccessToken = (accessToken) => {
    return new Promise(async resolve=>{

      global.signInStatus = false;

      let [ err ] = await handleActions(loadUserInfo, { accessToken });

      if (err) {

        if (err.message && err.message == 'Network request failed') {
          resolve('network error');
          return;
        }

        // token失效
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('token_expires');

        if (err.blocked) {
          resolve('block account');
        } else {
          resolve('sign in');
        }

        return;

      }

      handleActions(addAccessToken, { accessToken });
      global.signInStatus = true;
      resolve('has sign in');

    });
  }

  
  // 检查是否连网状态
  const checkNetwork = () => {
    return new Promise(resolve=>{
      NetInfo.getConnectionInfo().then(data => {
        resolve(data.type == 'none' ? false : true)
      });
    });
  }

  // 初始化app的数据
  global.initialAppDate = () => {
    return new Promise(async resolve => {

      console.log('init app data');

      // -----------------------
      // 检查是否有网络
      let networkStatus = await checkNetwork();
      if (!networkStatus) return resolve('network error');

      // -----------------------
      // 如果存在token，那么检测token，是否有效
      const accessToken = await AsyncStorage.getItem('token') || '';
      const expires = await AsyncStorage.getItem('token_expires');

      if (!accessToken) {
        socket.connect({ dispatch, getState });
        return resolve();
      }

      // ------------------------
      // token有效期在七天内，则不换token
      if (expires && parseInt(new Date().getTime()/1000) < parseInt(expires) - 60 * 60 * 24 * 7) {
        let res = await checkAccessToken(accessToken);
        socket.connect({ dispatch, getState });
        return resolve(res);
      }

      // --------------------------
      // 使用旧的token，兑换新的token
      let [ err, res ] = await To(handleActions(exchangeNewToken, {accessToken}));

      if (res && res.access_token && res.expires) {
        await AsyncStorage.setItem('token', res.access_token);
        await AsyncStorage.setItem('token_expires', res.expires);
        let res = await checkAccessToken(accessToken);
        resolve(res);
      } else {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('token_expires');
        resolve('sign in');
      }

      socket.connect({ dispatch, getState });

    });
  }

  global.signOut = () => {
    return new Promise(resolve=>{

      socket.close();

      AliyunPush.removeAll();

      global.signInStatus = false;

      // 移除 unlock token
      handleActions(removeUnlockToken);
      
      // 删除在本地储存的数据
      AsyncStorage.removeItem('binding-phone-tips', res => {});
      AsyncStorage.removeItem('token', res => {});
      AsyncStorage.removeItem('token_expires', res => {});

      // 删除posts本地缓存
      AsyncStorage.removeItem('posts-topic', res => {});
      AsyncStorage.removeItem('posts-title', res => {});
      AsyncStorage.removeItem('posts-content', res => {});
      
      // 删除评论缓存
      AsyncStorage.removeItem('comments-content', res => {});

      dispatch({ type:'CLEAN' });

      navigationService.restart();

      resolve();
    });
  }

}
