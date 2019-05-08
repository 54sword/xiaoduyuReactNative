package com.xiaoduyureactnative;

import android.app.Application;
import com.facebook.react.ReactApplication;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.psykar.cookiemanager.CookieManagerPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import cn.reactnative.modules.qq.QQPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.theweflex.react.WeChatPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;


import java.util.Arrays;
import java.util.List;
import android.util.Log;


// aliyun push
// 下面是被添加的代码
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.graphics.Color;
import android.os.Build;

import org.wonday.aliyun.push.AliyunPushPackage;

import com.alibaba.sdk.android.push.CloudPushService;
import com.alibaba.sdk.android.push.CommonCallback;
import com.alibaba.sdk.android.push.noonesdk.PushServiceFactory;
import com.alibaba.sdk.android.push.register.HuaWeiRegister;
import com.alibaba.sdk.android.push.register.MiPushRegister;
import com.alibaba.sdk.android.push.register.GcmRegister;
// 添加结束



public class MainApplication extends Application implements ReactApplication {

  private static final String TAG = "Init";

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new AliyunPushPackage(),
          new SplashScreenReactPackage(),
          new CookieManagerPackage(),
          new RNCWebViewPackage(),
          new QQPackage(),
          new PickerPackage(),
          new AsyncStoragePackage(),
          new RNGestureHandlerPackage(),
          new WeChatPackage(),
          new NetInfoPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    // aliyun push
    this.initCloudChannel(this);
  }


  // 下面是添加的代码
  private void initCloudChannel(final Context applicationContext) {

    // 创建notificaiton channel
    this.createNotificationChannel();
    PushServiceFactory.init(applicationContext);
    CloudPushService pushService = PushServiceFactory.getCloudPushService();
    pushService.setNotificationSmallIcon(R.mipmap.ic_launcher_s);//设置通知栏小图标， 需要自行添加
    pushService.register(applicationContext, "", "", new CommonCallback() {
      @Override
      public void onSuccess(String responnse) {
        Log.d(TAG, "init cloudchannel success");
        // success
      }
      @Override
      public void onFailed(String code, String message) {
        Log.d(TAG, "init cloudchannel failed -- errorcode:" + code + " -- errorMessage:" + message);
        // failed
      }
    });
    
    // 注册方法会自动判断是否支持小米系统推送，如不支持会跳过注册。
    MiPushRegister.register(applicationContext, "", "");
    // 注册方法会自动判断是否支持华为系统推送，如不支持会跳过注册。
    HuaWeiRegister.register(applicationContext);
    // 接入FCM/GCM初始化推送
    // GcmRegister.register(applicationContext, "", "");
  }


  private void createNotificationChannel() {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          NotificationManager mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
          // 通知渠道的id
          String id = "1";
          // 用户可以看到的通知渠道的名字.
          CharSequence name = "小度鱼";
          // 用户可以看到的通知渠道的描述
          String description = "小度鱼通知";
          int importance = NotificationManager.IMPORTANCE_HIGH;
          NotificationChannel mChannel = new NotificationChannel(id, name, importance);
          // 配置通知渠道的属性
          mChannel.setDescription(description);
          // 设置通知出现时的闪灯（如果 android 设备支持的话）
          mChannel.enableLights(true);
          mChannel.setLightColor(Color.RED);
          // 设置通知出现时的震动（如果 android 设备支持的话）
          mChannel.enableVibration(true);
          mChannel.setVibrationPattern(new long[]{100, 200, 300, 400, 500, 400, 300, 200, 400});
          //最后在notificationmanager中创建该通知渠道
          mNotificationManager.createNotificationChannel(mChannel);
      }
  }
  // 添加结束
  
}
