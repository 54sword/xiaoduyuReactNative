package com.xiaoduyureactnative;

import android.app.Application;

import com.facebook.react.ReactApplication;
import cn.reactnative.modules.qq.QQPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import ui.toasty.RNToastyPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import im.shimo.react.cookie.CookieManagerPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.theweflex.react.WeChatPackage;

import java.util.Arrays;
import java.util.List;

import cn.jpush.reactnativejpush.JPushPackage;
import com.github.alinz.reactnativewebviewbridge.WebViewBridgePackage;

public class MainApplication extends Application implements ReactApplication {

  // 设置为 true 将不会弹出 toast
  private boolean SHUTDOWN_TOAST = true;
  // 设置为 true 将不会打印 log
  private boolean SHUTDOWN_LOG = true;

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new QQPackage(),
            new VectorIconsPackage(),
            new RNToastyPackage(),
            new PickerPackage(),
            new CookieManagerPackage(),
            new SplashScreenReactPackage(),
            new WeChatPackage(),
            new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG),
            new WebViewBridgePackage()
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
  }
}
