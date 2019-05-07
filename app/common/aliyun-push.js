import { Platform } from 'react-native';

// https://github.com/aliyun/alicloud-ams-demo/blob/master/OpenApi2.0/push-openapi-nodejs-demo/Push.js
// https://help.aliyun.com/document_detail/30051.html?spm=a2c4g.11186623.2.17.296452f9yhC2y9
import AliyunPush from 'react-native-aliyun-push';
import AsyncStorage from '@react-native-community/async-storage';

import navigationService from '../navigators/service';

import To from './to';

// let notification = null;

// 是否监听
let isListening = false;

// 执行通知内的路由跳转
const handleJump = (notification, actionIdentifier) => {

  if (notification && actionIdentifier && actionIdentifier == 'opened' && notification.routeName && notification.params) {
    try {
      
      navigationService.popToTop();

      // ios 是对象，android 是字符串
      let params = typeof notification.params == 'object' ? notification.params : JSON.parse(notification.params);

      navigationService.navigate(notification.routeName, params);
    } catch (err) {
      console.log(err);
    }
  }

}

const handleAliyunPushMessage = (e) => {

  // console.log(e);

  if (e.type == 'notification') {
    handleJump(e.extras, e.actionIdentifier || '');
  }

    //e结构说明:
    //e.type: "notification":通知 或者 "message":消息
    //e.title: 推送通知/消息标题
    //e.body: 推送通知/消息具体内容
    //e.actionIdentifier: "opened":用户点击了通知, "removed"用户删除了通知, 其他非空值:用户点击了自定义action（仅限ios）
    //e.extras: 用户附加的{key:value}的对象
}

// 添加启动监听
export const addListener = async (navigation) => {

  if (isListening) return;

  // 监听推送事件
  AliyunPush.addListener(handleAliyunPushMessage);

  // app在未启动时收到通知后，点击通知启动app, 如果在向JS发消息时，
  // JS没准备好或者没注册listener，则先临时保存该消息， 
  // 并提供getInitalMessage方法可以获取，在app的JS逻辑完成后可以继续处理该消息
  const msg = await AliyunPush.getInitialMessage();
  if (msg) {
    setTimeout(()=>{
      handleAliyunPushMessage(msg);
    }, 3000);
  }

  isListening = true;

}

export const removeListener = () => {
  isListening = false;
  AliyunPush.addListener(handleAliyunPushMessage);
}

// 启动jpush，传入用户id
export const start = async (userId)=>{

  // ===================
  // 游客
  let [ err, result ] = await To(AsyncStorage.getItem('tourist'));
  
  if (result && userId) {
    // 移除游客别名
    await AsyncStorage.removeItem('tourist');
    await AliyunPush.removeAlias("tourist");
  } else if (!result && !userId) {
    // 设置游客别名
    await AsyncStorage.setItem('tourist', 'tourist');
    await AliyunPush.addAlias("tourist");
  }

  // ===================
  // 会员
  [ err, result ] = await To(AsyncStorage.getItem('member'));
  
  if (!result && userId) {
    // 设置会员别名
    await AsyncStorage.setItem('member', 'member');
    await AliyunPush.addAlias("member");
  } else if (result && !userId) {
    // 移除会员别名
    await AsyncStorage.removeItem('member');
    await AliyunPush.removeAlias("member");
  }

  // ===================
  // 绑定账户
  [ err, result ] = await To(AsyncStorage.getItem('account'));

  if (!result && userId) {
    // 绑定
    await AsyncStorage.setItem('account', userId);
    await AliyunPush.bindAccount(userId);
  } else if (result && !userId) {
    // 解除绑定
    await AsyncStorage.removeItem('account');
    await AliyunPush.unbindAccount();
  }
  
  /*
  AliyunPush.getDeviceId()
  .then((deviceId)=>{
      console.log("deviceId:"+deviceId);
  })
  .catch((error)=>{
    console.log(error);
      console.log("getDeviceId() failed");
  });
  
  
  AliyunPush.listAliases()
  .then((result)=>{
      console.log("listAliases success");
      console.log(JSON.stringify(result));
  })
  .catch((error)=>{
      console.log("listAliases error");
      console.log(JSON.stringify(error));
  });
  */


  // AliyunPush.setApplicationIconBadgeNumber(5);

  // AliyunPush.getApplicationIconBadgeNumber((num)=>{
  //   console.log("ApplicationIconBadgeNumber:" + num);
  // });
  
}

// 移除所有监听
export const removeAll = (userId) => {
  return new Promise(async resolve=>{

    // 游客
    await AsyncStorage.removeItem('tourist');
    await AliyunPush.removeAlias("tourist");

    if (userId) {
      
      // 会员
      await AsyncStorage.removeItem('member');
      await AliyunPush.removeAlias("member");

      // 登陆用户
      await AsyncStorage.removeItem(userId);
      await AliyunPush.unbindAccount();
    }

    resolve();

  });
}

/**
 * 设置角标，未读数
 * @param {[type]} n [Int] 未读数
 */
export const setBadge = (n) => {
  return new Promise(resove=>{
    if (n > 99) n == 99;

    if (Platform.OS === 'ios') {
      // JPushModule.setBadge(n, ()=>{
      //   resove();
      // });
    }

  });
}
