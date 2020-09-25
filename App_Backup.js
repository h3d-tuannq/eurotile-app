/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
 
import VovController from './View/share/VOVController'
import messaging from '@react-native-firebase/messaging';
import React, { useEffect,Component } from 'react';
import { SafeAreaView,  StyleSheet,   StatusBar , Button } from "react-native"; 
import {  Colors  } from 'react-native/Libraries/NewAppScreen';
import FirebaseController from './Controller/FirebaseController'
import AsyncStorage  from '@react-native-community/async-storage'
import Def from './Def/Def';
import { GoogleSignin , statusCodes } from '@react-native-community/google-signin';
import { Alert } from 'react-native';
import Style from "./Def/Style";



FirebaseController.requestUserPermission(); 
 
const App: () => React$Node = () => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => { Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));

    GoogleSignin.configure({
      scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
      webClientId: Def.WEB_CLIENT_ID, // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount


    });

    return unsubscribe;
  }, []);

   
  function onAuthStateChanged(user) {
    //setUser(user);
    console.log("onAuthStateChanged");
    console.log(user); 
    //if (user) setloggedIn(true);
  }
  
  /*
  AsyncStorage.getItem("login_token").then((value) => {
    if (value){
      alert(value);
    }
}).done();

  AsyncStorage.getItem("firebase_token").then((value) => { 
    if (value){
      alert(value);
    }
}).done();
 
AsyncStorage.getItem("email").then((value) => { 
  if (value){
    alert(value); 
  }
}).done();
*/
  


  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
            <Button
            title="Facebook Sign-In"
            onPress={() => FirebaseController.facebookLogin()}
          />
            <Button
            title="Google Sign-In"
            onPress={() => FirebaseController.googleLogin()}
          /> 
            <VovController /> 
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: Style.TITLE_SIZE,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: Style.SMALL_SIZE,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
