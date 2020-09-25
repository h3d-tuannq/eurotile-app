
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import analytics from '@react-native-firebase/analytics';
 
import { GoogleSignin , statusCodes } from '@react-native-community/google-signin'; 
import { LoginManager, AccessToken } from 'react-native-fbsdk';

import Def from '../Def/Def'
import AsyncStorage  from '@react-native-community/async-storage'
import NetUser from '../Net/NetUser'



GoogleSignin.configure({
    webClientId: Def.WEB_CLIENT_ID,
});
  
const SCREEN_VIEW_TAB = { 
    TAB_PERSONAL: 'PERSONAL',
    TAB_RADIO: 'RADIO',
    TAB_TV: 'TV',
    TAB_MUSIC: 'MUSIC',
    TAB_NEWS: 'NEWS',

};

const SCREEN_VIEW_PRODUCT = { 
    RADIO: 'RADIO/',
    TV: 'TV/',
    SONG: 'SONG/',
};

export default class FirebaseController{
    
    /*
        Dùng để tracking screen nào đang được xem. Có 2 kiểu ScreenView cần được track
            #1: view khi nhấn vào tab Cá Nhân, Radio, TV, Tin tức, Âm nhạc.
                Ví dụ:
                    import AnalysticController
                    AnalysticController.setScreenView(SCREEN_VIEW_TAB.TAB_PERSONAL);  

            #2: Track chương trình cụ thể đang xem:
                Ví dụ:
                    import AnalysticController
                    AnalysticController.setScreenView(`${SCREEN_VIEW_PRODUCT.RADIO}${product_name}`);  //product_name ở đây là tên kênh. Ví dụ VTV3, VOV2...
    */
    static setScreenView(screen_name){
        analytics().setCurrentScreen(screen_name); 
    }

 
    static googlesignOut = async () => {
      try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        auth()
          .signOut()
          .then(() => {
            
          
            if(  Def.setLoader) Def.setLoader(false);
              alert('Your are signed out!')
            });
        setloggedIn(false);
        // setuserInfo([]);
      } catch (error) {
        console.error(error);
      }
    };

    static onLoginSuccess(data){
      
      console.log("onLoginSuccess");
      //console.log(data);
      if(data['success']){
        email = data["data"]["email"];
        token = data["data"]["token"];
        AsyncStorage.setItem('login_token', `Bearer ${token}`); 
        AsyncStorage.setItem('email', email); 
        Def.login_token = `Bearer ${token}`;
        Def.email = email;
        console.log(Def.login_token);
        if(Def.refresh_channel_homepage)
          Def.refresh_channel_homepage();

        
        analytics().logEvent('login', {
          is: 'success',
          message: email
        } );


      }else{
        //FirebaseController.onLoginFailed(data["data"]["message"]);  
      }
 
    }

    static logout(){
      AsyncStorage.removeItem('login_token');
      Def.login_token = '';
    }
    //Error: [auth/account-exists-with-different-credential] An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.

    static onLoginFailed(data){
      console.log("onLoginFailed"); 
      
      if(  Def.setLoader)
      Def.setLoader(false);
      alert(`Login Failed ${JSON.stringify(data)}`);        
      analytics().logEvent('login', {
        is: 'failed',
        message: `error: ${data}`
      } ); 
    }

    static async  googleLogin(navigation=null) { 
      try {
        console.log("hasPlayServices");
        await GoogleSignin.hasPlayServices();
        console.log("hasPlayServices");
        const {accessToken, idToken} = await GoogleSignin.signIn();
        const credential = auth.GoogleAuthProvider.credential( idToken, accessToken,); 
        
        const googleUserCredential = await auth().signInWithCredential(credential);
        
 
 
        auth().currentUser.getIdToken( true).then(function(idToken) {
          console.log(`TOKEN: ${idToken}`); 
          if(navigation)
            navigation.navigate('Home');
          AsyncStorage.setItem('firebase_token', idToken); 
          
              analytics().logEvent('google_login', {
                  is: 'success',
                  message: ''
              });

          NetUser.signIn(FirebaseController.onLoginSuccess,FirebaseController.onLoginFailed,idToken);
          
          
        }).catch(function(error) {

          console.log(`error: ${error}`);
          
            analytics().logEvent('google_login', {
                    is: 'failed',
                    message: `error: ${error}`
                } );
        });


        //await auth().signInWithCredential(credential);

      } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          // user cancelled the login flow
          
          alert('Cancel');
        } else if (error.code === statusCodes.IN_PROGRESS) {
          alert('Signin in progress');
          // operation (f.e. sign in) is in progress already
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          alert('PLAY_SERVICES_NOT_AVAILABLE');
          // play services not available or outdated
        } else {
          // some other error happened
        }

        
        if(  Def.setLoader)
          Def.setLoader(false);
      }
    }; 

    static async facebookLogin(navigation=null) {
      // Attempt login with permissions
      const result = await LoginManager.logInWithPermissions(['email']);
    
      console.log('logInWithPermissions'); 
      console.log(data);

      if (result.isCancelled) {
        
        if(  Def.setLoader)
          Def.setLoader(false);
        alert('User cancelled the login process');
        throw 'User cancelled the login process';
      }
    
      // Once signed in, get the users AccesToken
      const data = await AccessToken.getCurrentAccessToken();
    
      if (!data) {
        
        if(  Def.setLoader)
          Def.setLoader(false);
        alert('Something went wrong obtaining access token');
        throw 'Something went wrong obtaining access token';  
      }
    
      console.log('getCurrentAccessToken'); 
      console.log(data);
      // Create a Firebase credential with the AccessToken
      const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
      console.log('FacebookAuthProvider'); 

       auth().signInWithCredential(facebookCredential)
        .then(user => {
                //console.warn(JSON.stringify(firebaseUserCredential.user.toJSON()));
                console.log('Signed in with Facebook!');
                auth().currentUser.getIdToken(true).then(function(idToken) {
                  console.log('Signed in with Facebook 1!');
                  if(navigation)
                    navigation.navigate('Home');
                    console.log('Signed in with Facebook 2!');

                  console.log(`TOKEN: ${idToken}`); 
                  console.log('Signed in with Facebook 3!');
                  NetUser.signIn(FirebaseController.onLoginSuccess,FirebaseController.onLoginFailed,idToken);
                  console.log('Signed in with Facebook 4!');
                            
                  analytics().logEvent('facebook_login', {
                      is: 'success',
                      message: ''
                  });
                  
                }).catch(function(error) {
                  
                if( Def.setLoader) Def.setLoader(false);
                  alert(`facebook_login err ${error}`);
                  analytics().logEvent('facebook_login', {
                          is: 'failed',
                          message: `error: ${error}`
                      } );
                });
                console.log('Signedd in with Facebook!');
        })
        .catch(error => {
          Def.setLoader(false);
           
          alert(error);
        })
 

    
    }

    static async emailSignup(email,password,navigation=null){
      auth()
      .createUserWithEmailAndPassword(email.trim().toLowerCase(), password)
      .then(() => {
        
        alert("Bạn đã tạo tài khoản thành công, vui lòng đăng nhập");
        if(  Def.setLoader) Def.setLoader(false);
        analytics().logEvent('email_signup', {
          is: 'success',
          message: ''
        } );

        if(navigation)
          navigation.navigate('signIn'); 
      })
      .catch(error =>  {
          
          analytics().logEvent('email_signup', {
            is: 'failed',
            message: `error: ${error}`
          } );

          
        
          if(  Def.setLoader) Def.setLoader(false);
          alert(error.message);

      });

    }

    static async emailLogin(email,password,navigation=null){
      console.log('emailLogin');
      auth()
      .signInWithEmailAndPassword(email.trim().toLowerCase(), password)
      .then(function(result){
 
        auth().currentUser.getIdToken(true)
        .then(function(token) {
          console.log(`TOKEN: ${token}`); 
          AsyncStorage.setItem('firebase_token', token); 
          if(navigation)
            navigation.navigate('Home'); 
          NetUser.signIn(FirebaseController.onLoginSuccess,FirebaseController.onLoginFailed,token);
                            
            analytics().logEvent('email_login', {
              is: 'success',
              message: ''
            });
          
        })
        .catch(error => {
          
            analytics().logEvent('email_login', {
              is: 'failed',
              message: `error: ${error}`
            } );
            
           if(  Def.setLoader) Def.setLoader(false);
            alert(error.message);

        });

 
    
    })
    .catch(error => {
          
      analytics().logEvent('email_login', {
        is: 'failed',
        message: `error: ${error}`
      } );
      
      if(  Def.setLoader) Def.setLoader(false);
      alert(error.message);

  });


 

    }

    static onSetNotiSuccess(data){
        
      console.log("onLoginSuccess");
      //console.log(data);
      if(data['success']){
        token = data["data"]["token"];
        AsyncStorage.setItem('login_token', `Bearer ${token}`); 
        Def.login_token = `Bearer ${token}`;
        console.log(Def.login_token);
      }else{
        //FirebaseController.onLoginFailed(data["data"]["message"]);
      }

    }
  

    static onSetNotiFailed(data){
      
      console.log("onLoginFailed");
      //console.log(data);
    }

    static async requestUserPermission () {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
      if (enabled) {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
          console.log(fcmToken);
          console.log("Your Firebase Token is:", fcmToken);

          Def.notification_token = fcmToken;
          AsyncStorage.setItem('notification_token', fcmToken);

          AsyncStorage.getItem("email").then((value) => { 
            if (value){
              Def.email = value;
            }
            NetUser.setNotification(FirebaseController.onSetNotiSuccess,FirebaseController.onSetNotiFailed);
          }).done();

          

        } else {
          console.log("Failed", "No token received");
        }

        console.log('Authorization status:', authStatus);
      }
    }

    static resetPassword(email){
      return auth().sendPasswordResetEmail(email);
    }

}