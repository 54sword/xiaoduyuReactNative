import { Platform, AsyncStorage } from 'react-native';
import JPushModule from 'jpush-react-native';

import navigationService from '../actions/navigation-service';

let notification = null;

// 执行通知内的路由跳转
const handleJump = (notification) => {

  if (!notification.routeName || !notification.params) {
    console.log('点击通知跳转失败');
    return;
  }

  navigationService.popToTop();
  navigationService.navigate(notification.routeName, notification.params);

  // navigation.popToTop();
  // setTimeout(()=>{
    // navigation.navigate(notification.routeName, notification.params);
  // }, 500);
}

// 添加启动监听
export const addListener = (navigation) => {

  console.log('添加 jpush 监听事件');

  // app未启动，通过点击通知启动app触发
  // 如果app没有退出，开发环境，每次runload都会触发
  // 接收app未启动，点击的通知的对象，等待app进入首页以后，再触发通知
  JPushModule.addOpenNotificationLaunchAppListener(result => {
    if (result) notification = result;
  });

  // 在app启动时候
  JPushModule.addReceiveOpenNotificationListener(result=>{
    if (result) handleJump(result);
  });

}

// 启动jpush，传入用户的别名（id）
export const start = (userId)=>{

  // if (Platform.OS === 'ios') {
    // 初始化 JPush，这个方法初始化推送功能 iOS 会弹出获取推送权限的提示框（注意这个系统提示框只会触发一次，如果用户首次不同意，之后需要用户到设置中修改推送权限）。
    JPushModule.initPush();
  // }

  if (notification) {
    handleJump(notification);
    notification = null;
  }

  // 如果是没有登陆的用户，清空别名和标签
  if (!userId) return empty();

  // 设置别名, 发送给指定的用户
  AsyncStorage.getItem('jpush_alias', (errs, result)=>{

    if (errs || result) return;

    AsyncStorage.setItem('jpush_alias', userId, (errs, result)=>{
      JPushModule.setAlias(userId, res=>{}, res=>{});
    });

  });

  // 设置标签，推送已登陆的用户
  AsyncStorage.getItem('jpush_tag', (errs, result)=>{

    if (errs || result) return;

    let tag = 'signin';

    AsyncStorage.setItem('jpush_tag', tag, (errs, result)=>{
      JPushModule.setTags(tag.split(','), res=>{}, res=>{});
    });

  });

}

/**
 * 清空别名和标签
 */
export const empty = () => {

  // 设置别名
  AsyncStorage.removeItem('jpush_alias', ()=>{
    JPushModule.setAlias('invalid', ()=>{});
  });

  // 清除tag
  AsyncStorage.removeItem('jpush_tag', ()=>{
    JPushModule.setTags(['invalid'], ()=>{});
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
      JPushModule.setBadge(n, ()=>{
        resove();
      });
    }

  });
}
