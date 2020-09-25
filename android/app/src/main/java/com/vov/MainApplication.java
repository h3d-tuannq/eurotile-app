package com.vov;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication; 
import com.reactnativecommunity.slider.ReactSliderPackage;
import cl.json.RNSharePackage; 
import com.RNFetchBlob.RNFetchBlobPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.dooboolab.RNAudioRecorderPlayerPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.reactnativerestart.RestartPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.tanguyantoine.react.MusicControl;
import io.invertase.firebase.admob.ReactNativeFirebaseAdmobPackage;
import com.sbugert.rnadmob.RNAdMobPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnativecommunity.viewpager.RNCViewPagerPackage;
import com.horcrux.svg.SvgPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

import org.wonday.orientation.OrientationPackage;
import org.wonday.orientation.OrientationActivityLifecycle;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.react.shell.MainReactPackage;
import java.util.Arrays;
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
import io.invertase.firebase.auth.ReactNativeFirebaseAuthPackage;
import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;  // <--- import
import io.invertase.firebase.analytics.ReactNativeFirebaseAnalyticsPackage;
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
import com.facebook.react.bridge.JSIModulePackage;
import com.swmansion.reanimated.ReanimatedJSIModulePackage;
public class MainApplication extends Application implements ReactApplication {
  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();
  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          //return packages;
           return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
            new OrientationPackage(),
            new ReactSliderPackage(),
            new RNSharePackage(),
            new ReanimatedPackage(),
            new RNFetchBlobPackage(),
            new RNDeviceInfo(),
            new RNAudioRecorderPlayerPackage(),
            new BackgroundTimerPackage(),
            new RestartPackage(),
            new SplashScreenReactPackage(),
            new FBSDKPackage(), 
            new RNCWebViewPackage(),
            new MusicControl(),
            new ReactNativeFirebaseAdmobPackage(),
            new RNAdMobPackage(),
            new AsyncStoragePackage(),
            new RNCViewPagerPackage(),
            new SvgPackage(),
            new RNGestureHandlerPackage(),
              new ReactVideoPackage(),
              new ReactNativeFirebaseAuthPackage(),
              new ReactNativeFirebaseAppPackage(),
              new ReactNativeFirebaseMessagingPackage(),
              new RNGoogleSigninPackage(),
              new ReactNativeFirebaseAnalyticsPackage(),
              new SafeAreaContextPackage()
          );

        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
        @Override
        protected JSIModulePackage getJSIModulePackage() {
            return new ReanimatedJSIModulePackage(); // <- add
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
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    registerActivityLifecycleCallbacks(OrientationActivityLifecycle.getInstance());
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.vov.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
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
