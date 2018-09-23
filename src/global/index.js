
import React from 'react';
import { AsyncStorage, NetInfo, Platform } from 'react-native';
import Dimensions from 'Dimensions';

// tools
// import websocket from '../common/websocket';
import To from '../common/to';
import * as JPush from '../common/jpush';



// redux
import navigationService from '../actions/navigation-service';

import { loadUserInfo, addAccessToken } from '../actions/user';

import { cleanBlockData } from '../actions/block';
import { cleanBroadcastData } from '../actions/broadcast';
import { cleanCaptchaData } from '../actions/captcha';
import { cleanCommentData } from '../actions/comment';
import { cleanFollowData } from '../actions/follow';
import { cleanNotificationData } from '../actions/notification';
import { cleanPeopleData } from '../actions/people';
import { cleanPostsData } from '../actions/posts';
import { cleanTopicData } from '../actions/topic';
import { cleanUserData } from '../actions/user';
import { checkClientInstalled } from '../actions/client-installed';
import { exchangeNewToken } from '../actions/token';

// styles
import styles from '../styles';

import { debug } from '../../config';

global.debug = debug;
global.styles = styles;
global.OS = Platform.OS;


// 登陆状态
global.signInStatus = false;

// 解锁token
global.unlockToken = false;

global.screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
}

export default ({ dispatch, getState }) => {

  const handleActions = (fn, parameter) => {
    return fn(parameter)(dispatch, getState);
  }

  // 通过 accessToken 获取个人资料，以验证 token 是否有效
  const checkAccessToken = (accessToken) => {
    return new Promise(async resolve=>{

      global.signInStatus = false;

      let [ err, res ] = await handleActions(loadUserInfo, { accessToken });

      if (err && err == 'Network request failed') {
        resolve('network error');
      } else if (res) {
        handleActions(addAccessToken, { accessToken });
        global.signInStatus = true;
        resolve('has sign in');
      } else {

        // token失效
        AsyncStorage.removeItem('token', ()=>{
        AsyncStorage.removeItem('token_expires', ()=>{
          // 判断账户是否是被封
          if (res && res.blocked) {
            resolve('block account');
          } else {
            resolve('sign in');
          }
        });
        });

      }

    });
  }

  /*
  // 获取当前网络状态
  const getNetInfo = () => {

    return new Promise(resolve=>{

      NetInfo.getConnectionInfo().then((connectionInfo) => {
        console.log(connectionInfo);
        resolve();
      });

      function handleFirstConnectivityChange(connectionInfo) {
        console.log('First change, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
      }

      NetInfo.addEventListener(
        'connectionChange',
        handleFirstConnectivityChange
      );

    });

  }
  */


  // 初始化app的数据
  global.initialAppDate = () => {
    return new Promise(async resolve => {

      // try {

        // 如果存在token，那么检测token，是否有效
        const accessToken = await AsyncStorage.getItem('token');
        const expires = await AsyncStorage.getItem('token_expires');

        if (!accessToken) return resolve();

        // token有效期在七天内，则不换token
        if (expires && new Date().getTime() < parseInt(expires) - 1000 * 60 * 60 * 24 * 7) {
          let res = await checkAccessToken(accessToken);
          return resolve(res);
        }

        // 使用旧的token，兑换新的token
        let [ err, res ] = await To(handleActions(exchangeNewToken, accessToken));

        if (res && res.access_token && res.expires) {

          // 储存token
          AsyncStorage.setItem('token', res.access_token, function(errs, result){
            // 储存token有效时间
            AsyncStorage.setItem('token_expires', res.expires, async (errs, result) => {
              let res = await checkAccessToken(accessToken);
              resolve(res);
            });
          });

        } else {
          resolve('sign in');
        }

    // } catch (err) {
      // console.log(err);
    // }

    });
  }

  global.signOut = () => {
    return new Promise(resolve=>{

      JPush.empty();

      global.signInStatus = false;
      global.unlockToken = false;

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

      // websocket.stop();

      // 清除用户在redux中的数据
      handleActions(cleanBlockData);
      handleActions(cleanBroadcastData);
      handleActions(cleanCaptchaData);
      handleActions(cleanCommentData);
      handleActions(cleanFollowData);
      handleActions(cleanNotificationData);
      handleActions(cleanPeopleData);
      handleActions(cleanPostsData);
      handleActions(cleanTopicData);
      handleActions(cleanUserData);

      navigationService.restart();

      resolve();
    });
  }

  /*
  // 初始化redux数据
  global.initReduxDate = (callback) => {

    // 清空之前的数据
    global.cleanRedux();

    // 检测是否安装了某些客户端
    checkClientInstalled()(dispatch, getState)

    // 如果存在token，那么检测token，是否有效
    AsyncStorage.getItem('token', (errs, accessToken)=>{

      // return callback('sign in')

      if (!accessToken) return callback('sign in')

      AsyncStorage.getItem('token_expires', (errs, expires)=>{

        // 提前7天兑换新的token
        if (expires && new Date().getTime() > parseInt(expires) - 1000 * 60 * 60 * 24 * 7) {

          // console.log(accessToken);

          exchangeNewToken({
            accessToken,
            callback: (res)=>{

              // console.log('=========');
              // console.log(res.success);

              if (res && res.success) {
                // 储存token
                AsyncStorage.setItem('token', res.data.access_token, function(errs, result){
                  // 储存token有效时间
                  AsyncStorage.setItem('token_expires', (new Date().getTime() + 1000 * 60 * 60 * 24 * 30) + '', function(errs, result){
                    load(accessToken, callback)
                  })
                })
              } else if (res && !res.success) {

                // 判断账户是否是被封
                if (res._error && res._error == 10007) {
                  callback('block account')
                } else {
                  callback('sign in')
                }

              } else {
                callback('network error')
              }

            }
          })(dispatch, getState)

          return
        }

        load(accessToken, callback)

      })
    })

  }
  */

}
