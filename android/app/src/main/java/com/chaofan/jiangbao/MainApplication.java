package com.chaofan.jiangbao;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import com.microsoft.codepush.react.CodePush;

import com.chaofan.jiangbao.aliay.AlipayModuleReactPackage;
import com.chaofan.jiangbao.wxapi.WxpayPackage;

import com.chaofan.jiangbao.share.RNUMConfigure;
import com.umeng.commonsdk.UMConfigure;
import com.umeng.socialize.PlatformConfig;
import com.chaofan.jiangbao.share.DplusReactPackage;
import com.bugsnag.BugsnagReactNative;
import cn.jiguang.plugins.push.JPushModule;

import java.util.Arrays;
import java.util.List;
public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected String getJSBundleFile() {
          return CodePush.getJSBundleFile();
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          packages.add(new WxpayPackage());
          packages.add(new AlipayModuleReactPackage());
          packages.add(new DplusReactPackage());
          return packages;
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
    initializeFlipper(this); // Remove this line if you don't want Flipper enabled
    BugsnagReactNative.start(this);
    RNUMConfigure.init(this, "5d53936f3fc19594650009c5", "Umeng", UMConfigure.DEVICE_TYPE_PHONE, "");
    JPushModule.registerActivityLifecycle(this);
    // 配置平台key、secret信息
    PlatformConfig.setWeixin("wx41175020089e71e5", "2330d9a586faa45cc24647648ae579b5");
    PlatformConfig.setQQZone("110xxxxxx59", "3JjbG8aXxxxxsV");
    PlatformConfig.setSinaWeibo("27xxxxxxx964", "fac50980a44e3e3afdxxxa572887", "http://sns.whalecloud.com");
  }

  /**
   * Loads Flipper in React Native templates.
   *
   * @param context
   */
  private static void initializeFlipper(Context context) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
        aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
