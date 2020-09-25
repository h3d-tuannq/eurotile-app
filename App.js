import * as React from 'react';

import {Component, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,StatusBar, PixelRatio

} from 'react-native';

import Orientation from 'react-native-orientation-locker';
import MusicControl from 'react-native-music-control';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import MyProfileIcon from './assets/icon/icon-myprofile.svg';
import MyProfileIconSelect from './assets/icon/icon_myprofile_select.svg';

import RadioIcon from './assets/icon/icon-radio.svg';
import RadioIconSelect from './assets/icon/icon_radio_select.svg';

import TvIcon from './assets/icon/icon-tv.svg';
import NotiIcon from './assets/icon/icon-notification.svg';
import TvIconSelect from './assets/icon/icon_tv_select.svg';

import MusicIcon from './assets/icon/icon-music.svg';
import MusicIconSelect from './assets/icon/icon_music_select.svg';

import NewsIcon from './assets/icon/icon-news.svg';
import NewsIconSelect from './assets/icon/icon_news_select.svg';
import BackIcon from './assets/icon/icon-back.svg';
import Video from 'react-native-video';

import RNRestart from 'react-native-restart';
import MyStack from './component/view/MyStack';
import RadioStack from './component/view/RadioStack';
import TvStack from './component/view/TvStack';
import MusicStack from './component/view/MusicStack';
import NewsStack from './component/view/NewsStack';

import LoginStack from './component/view/LoginStack';
import PlayRadioStack from './component/view/PlayRadioStack';
import PlayMusicStack from './component/view/PlayMusicStack';

import analytics from '@react-native-firebase/analytics';
import SplashScreen from 'react-native-splash-screen';


import PolicyIcon from './assets/icon/icon-policy.svg';
import GuideIcon from './assets/icon/icon-how-to-use.svg'
import AlarmIcon from './assets/icon/icon-sleep-time.svg'
import FeedbackIcon from './assets/icon/icon-feedback2.svg'
import RuleIcon from './assets/icon/icon-rule.svg';

const {width, height} = Dimensions.get('window');

import messaging from '@react-native-firebase/messaging';

import FirebaseController from './Controller/FirebaseController';

import AsyncStorage from '@react-native-community/async-storage';
import Def from './Def/Def';
import NetDailyContent from './Net/NetDailyContent';

const Stack = createStackNavigator();
const RootStack = createStackNavigator();

messaging().onMessage(async (remoteMessage) => {
  //
  //alert(JSON.stringify(remoteMessage));
  Alert.alert(
    remoteMessage.notification.title,
    remoteMessage.notification.body,
    [
      {
        text: 'Bỏ qua',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Đồng ý',
        onPress: () => {
          goLink(remoteMessage.data.url);
        },
      },
    ],
    {cancelable: false},
  );
});

function goLink(link) {
  //alert(link);
  if (link.startsWith('http')) {
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err),
    );
  } else if (link.startsWith('vov://channel')) {
    id = link.replace('vov://channel/', '');
    //alert(`channel ${id}`);

    if (Def.channels_data_radio) {
      Object.entries(Def.channels_data_radio).map((prop, key) => {
        for (let i = 0; i < prop[1].length; i++) {
          console.log(`${prop[1][i].id} - ${id}`);
          if (parseInt(prop[1][i].id) == parseInt(id)) {
            Def.setItemRadio(prop[1][i], prop[1]);
            Def.mainNavigate.navigate('PlayRadio', {
              screen: 'commonPlayRadio',
              params: {item: prop[1][i], data: prop[1]},
            });
          }
        }
      });
    }

    //NetChannel.getChannelById(this.onChannelSuccess,this.onChannelErr,id);
    //
  } else if (link.startsWith('vov://program')) {
    id = link.replace('vov://program/', '');

    //alert(`program ${id}`);
    NetDailyContent.getContent(onProgramSuccess, onProgramErr, id);
  }
}

function onProgramSuccess(data) {
  console.log('NotificationItemrenderer onProgramSuccess');
  console.log(data.data);
  Def.setItemDailyContent(data.data);
}
function onProgramErr(data) {}

const styles = StyleSheet.create({
  baseText: {
    fontFamily: 'Cochin',
  },
  titleText: {
    fontSize: Style.TITLE_SIZE,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  tabBarIconStyle: {
    width: 27,
    height: 18,
    color: 'red',
  },

  infoText: {
    fontSize: Style.NORMAL_SIZE,
    color: '#b3b3b3',
    marginVertical: PixelRatio.get() < 2 ? 6 :10,
  },
});

import MiniPlayer from './component/view/common/RadioMiniPlayer';
const program = {
  title: 'Fifth Item',
  imagePath: '',
  time: '30:00 (19:00, 24/7/2020)',
  chanelName: 'VOV1 - Kênh Thời Sự',
  programName: 'Tên chương trình đang phát',
};

function MyTabBar(props) {
  const {state, descriptors, navigation} = props;
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  //console.log('Routes :'+JSON.stringify(state.routes) + 'Index ' + state.index )

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View>
      {!(
        state.index == 1  &&
        state.routes[1] &&
        state.routes[1].state &&
        state.routes[1].state.routes &&
        state.routes[1].state.routes[state.routes[1].state.index].state.index == 1) ? (
        <MiniPlayer item={props.item} />
      ) : (
        <View />
      )}
      <View style={{flexDirection: 'row',
          backgroundColor : '#fff',
           borderTopWidth:1,
          borderTopColor : '#d1d3d4'
        }}
      >
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const icon =
            options.tabBarIcon !== undefined ? options.tabBarIcon : null;

          const activeTintColor = props.activeTintColor
            ? props.activeTintColor
            : '#673ab7';
          const inactiveTintColor = props.inactiveTintColor
            ? props.inactiveTintColor
            : '#222';

          const color = isFocused ? activeTintColor : inactiveTintColor;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityStates={isFocused ? ['selected'] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[
                {
                  flex: 1,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                },
                props.tabStyle,
              ]}
              key={index}>
              {icon({route, focused: isFocused, color})}

              <Text style={[{color: color}, props.labelStyle]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const Tab = createBottomTabNavigator();

function MainTab() {
  return (
    <Tab.Navigator
      style={{height: 120, paddingVertical: 20 , backgroundColor : 'red'}}
      tabBar={(props) => <MyTabBar {...props} item={program} />}
      tabBarOptions={{
        activeTintColor: Style.DEFAUT_RED_COLOR,
        inactiveTintColor: '#b3b3b3',
        labelStyle: {
          fontSize: Style.NORMAL_SIZE,
        },
        style: {height: 50},
        tabStyle: {
          paddingVertical: 5,
          paddingTop :8,
        },
        // item:program
      }}>

        <Tab.Screen
            name="Home"
            component={MyStack}
            options={{
                tabBarLabel: 'Cá nhân',
                tabBarIcon: ({focused, color, size}) => {
                    analytics().setCurrentScreen(Def.TAB_PERSONAL);

                    if (focused) {
                        Def.refresh_channel_homepage();
                        return <MyProfileIconSelect style={styles.tabBarIconStyle} />;
                    }
                    return <MyProfileIcon style={styles.tabBarIconStyle} />;
                },
            }}
        />

        <Tab.Screen
        name="Music"
        component={MusicStack}
        options={(route) => {
          return route.route.state &&
            route.route.state.routes &&
            route.route.state.routes[1] &&
            route.route.state.routes[1].params.screen == 'player'
            ? {tabBarVisible: false}
            : {
                tabBarLabel: 'Sản phẩm',
                tabBarIcon: ({focused, color, size}) => {
                  analytics().setCurrentScreen(Def.TAB_MUSIC);
                  if (focused) {
                    return <MusicIconSelect style={styles.tabBarIconStyle} />;
                  }
                  return <MusicIcon style={styles.tabBarIconStyle} />;
                },
              };
        }}
      />


      <Tab.Screen
        name="News"
        component={NewsStack}
        options={{
          tabBarLabel: 'Tin tức',
          tabBarIcon: ({focused, color, size}) => {
            analytics().setCurrentScreen(Def.TAB_NEWS);
            if (focused) {
              return <NewsIconSelect style={styles.tabBarIconStyle} />;
            }
            return <NewsIcon style={styles.tabBarIconStyle} />;
          },
        }}
      />

    </Tab.Navigator>
  );
}

import CustomMenuScreen from './component/view/news/modal/CustomMenuScreen'

function AppStack() {
  return (
    <RootStack.Navigator headerMode="none">
      <Stack.Screen name="tab" component={MainTab} />
      <Stack.Screen name="Login" component={LoginStack} />
      <Stack.Screen name="PlayRadio" component={PlayRadioStack} />
      <Stack.Screen name="PlayMusic" component={PlayMusicStack} />
      <Stack.Screen name="CustomMenu" component={CustomMenuScreen} />

      {/*<Stack.Screen name="commonPlayRadio" component={CommonRadioPlayer} />*/}
      {/*<Stack.Screen name='commonInteract' component={InteractModal}/>*/}
    </RootStack.Navigator>
  );
}

import {
  createDrawerNavigator,
  DrawerItemList,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import {Container, Content, Header, Left, Body, Icon} from 'native-base';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          height: Style.HEADER_HEIGHT,
          backgroundColor: Style.DEFAUT_RED_COLOR,
          flexDirection: 'row',
          // justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{padding: 5}}
          onPress={() => {
            props.navigation.closeDrawer();
          }}>
          <BackIcon width={25} height={25} />
        </TouchableOpacity>
        <Text style={{marginLeft: 30, fontSize:(Def.email == null || Def.email == '') ? Style.TITLE_SIZE : Style.NORMAL_SIZE, color: '#fff'}}>
          {Def.email == null || Def.email == '' ? 'Cài đặt' : Def.email}
        </Text>
        <View />
      </View>
      <DrawerContentScrollView {...props}>
        <View style={{flex: 1}}>
          {Def.email == null || Def.email == '' ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: PixelRatio.get() < 2 ? 3 :5,
                paddingHorizontal: 10,
                marginTop: PixelRatio.get() < 2 ? 6 :10,
                marginBottom: PixelRatio.get() < 2 ? 6 :10,
                  // backgroundColor : 'red'
              }}>
              <TouchableOpacity
                style={{
                  width: width * 0.35,
                  borderRadius: 5,
                  paddingVertical: PixelRatio.get() < 2 ? 5 :8,
                  backgroundColor: Style.DEFAUT_BLUE_COLOR,
                  alignItems: 'center',
                }}
                onPress={() => {
                  props.navigation.navigate('Login', {screen: 'signIn'});
                }}>
                <Text style={{fontSize: Style.TITLE_SIZE, color: '#fff'}}> Đăng nhập </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: width * 0.35,
                  borderRadius: 5,
                  paddingVertical: PixelRatio.get() < 2 ? 5 :8,
                  backgroundColor: Style.DEFAUT_RED_COLOR,
                  alignItems: 'center',
                }}
                onPress={() => {
                  props.navigation.navigate('Login', {screen: 'signUp'});
                }}>
                <Text style={{fontSize: Style.TITLE_SIZE, color: '#fff'}}> Đăng ký </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                  paddingVertical: PixelRatio.get() < 2 ? 3 :5,
                paddingHorizontal: 10,
                  marginTop: PixelRatio.get() < 2 ? 6 :10,
                  marginBottom: PixelRatio.get() < 2 ? 6 :10,
              }}>
              <TouchableOpacity
                style={{
                  width: width * 0.35,
                  borderRadius: 5,
                    paddingVertical: PixelRatio.get() < 2 ? 5 :8,
                  backgroundColor: 'green',
                  alignItems: 'center',
                }}
                onPress={() => {
                  AsyncStorage.removeItem('email');
                  AsyncStorage.removeItem('firebase_token');
                  RNRestart.Restart();
                }}>
                <Text style={{fontSize: Style.TITLE_SIZE, color: '#fff'}}> Đăng xuất </Text>
              </TouchableOpacity>
            </View>
          )}

          <DrawerItemList {...props} />
          {/*<DrawerItem*/}
          {/*label="Help"*/}
          {/*onPress={() => {console.log('item click')}}*/}
          {/*/>*/}
        </View>
      </DrawerContentScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          padding: 5,
          paddingLeft: 10,
          zIndex: 10,
        }}>
        <Text style={styles.infoText}>Hotline: (024).38256622</Text>
        <Text style={styles.infoText}>Email: trungtamkythuatvov@gmail.com</Text>
        <Text style={styles.infoText}>Website: http://kythuatvov.vn</Text>
        <Text style={styles.infoText}>Phiên bản 1.0</Text>
      </View>
    </View>
  );
}

import NotificationScreen from './component/view/common/NotificationScreen';
import PrivacyScreen from './component/view/common/PrivacyScreen';
import TermScreen from './component/view/common/TermScreen';

import FeedbackScreen from './component/view/common/modal/FeedBackModal';
import ShutDownAlarmModal from './component/view/radio/modal/ShutDownAlarmModal';

import Style from "./Def/Style";
import GuideScreen from "./component/view/common/GuideScreen";

function AppDrawer() {
    const iconSize = PixelRatio.get() <2 ? 18 : 20;
  analytics().setCurrentScreen(Def.SCREEN_APP_DRAWER);
  return (
    <Drawer.Navigator
      initialRouteName="VOV"
      drawerStyle={{
        width: width * 0.8,
      }}

      drawerContentOptions={{
          // activeTintColor: '#e91e63',
          itemStyle: { marginVertical: 0, height : PixelRatio.get() < 2 ? 35 :40, paddingVertical:0, justifyContent:'center'},
      }}

      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="VOV"
        component={AppStack}
        options={{
          drawerIcon: ({focused: boolean, color: string, size: number}) => {
            return <NotiIcon width={iconSize} height={iconSize} />;
          },
        }}
      />
      <Drawer.Screen
        name="Thông báo"
        component={NotificationScreen}
        options={{
          drawerIcon: ({focused: boolean, color: string, size: number}) => {
            return <NotiIcon width={iconSize} height={iconSize} />;
          },
        }}
      />
      <Drawer.Screen
        name="Góp ý, báo lỗi"
        options={{
          drawerIcon: ({focused: boolean, color: string, size: number}) => {
            return <FeedbackIcon width={iconSize} height={iconSize} />;
          },
        }}>
        {(props) => (
          <FeedbackScreen
            {...props}
            title={'Góp ý phản hồi'}
            hidePlayer={true}
          />
        )}
      </Drawer.Screen>

      <Drawer.Screen
        name="Hẹn giờ tắt"
        component={ShutDownAlarmModal}
        options={{
          drawerIcon: ({focused: boolean, color: string, size: number}) => {
            return <AlarmIcon width={iconSize} height={iconSize} />;
          },
        }}
      />

        <Drawer.Screen
            name="Hướng dẫn sử dụng"
            component={GuideScreen}
            options={{
                drawerIcon: ({focused: boolean, color: string, size: number}) => {
                    return <GuideIcon width={iconSize} height={iconSize} />;
                },
            }}
        />

      <Drawer.Screen
        name="Điều khoản sử dụng"
        component={TermScreen}
        options={{
          drawerIcon: ({focused: boolean, color: string, size: number}) => {
            return <RuleIcon width={iconSize} height={iconSize} />;
          },
        }}
      />

      <Drawer.Screen
        name="Chính sách bảo mật"
        component={PrivacyScreen}
        options={{
          drawerIcon: ({focused: boolean, color: string, size: number}) => {
            return <PolicyIcon width={iconSize} height={iconSize} />;
          },
        }}
      />
    </Drawer.Navigator>
  );
}

//import SplashScreen from 'react-native-splash-screen'

export default class App extends Component {
  state = {
    paused: false,
    index: 0,
    timer: null,
    url: '',
  };

  constructor(props) {

    Orientation.lockToPortrait();

    super(props);
    console.log('export default class App extends Component');

    this.seek = this.seek.bind(this);
    Def.seek = this.seek;
    this.pauseVideo = this.pauseVideo.bind(this);
    this.playVideo = this.playVideo.bind(this);
    this.scheduleVideo = this.scheduleVideo.bind(this);
    this.videoError = this.videoError.bind(this);
    this.onBuffer = this.onBuffer.bind(this);
  this.onAudioFocusChanged = this.onAudioFocusChanged.bind(this);
    Def.global_player_stop = this.pauseVideo;
    Def.global_player_start = this.playVideo;
    Def.global_player_schedule = this.scheduleVideo;
    Def.global_player_is_stop = false;

    AsyncStorage.getItem('email').then((value) => {
      if (value) {
        Def.email = value;
      }
    });
    AsyncStorage.getItem('firebase_token').then((value) => {
      if (value) {
        Def.firebase_token = value;
      }
    });
    AsyncStorage.getItem('notification_token').then((value) => {
      if (value) {
        Def.notification_token = value;
      }
    });
    AsyncStorage.getItem('login_token').then((value) => {
      if (value) {
        Def.login_token = value;
      }
    });

    FirebaseController.requestUserPermission();

  }

  componentDidMount() {

      SplashScreen.hide();

      MusicControl.setNowPlaying({
        title: 'VOV',
        artist: 'VOV Mobile',
        artwork: 'http://dinhnhohao.hopto.org/vov_logo.jpg',
        album: 'Thriller',
        genre: 'Post-disco, Rhythm and Blues, Funk, Dance-pop',
        duration: 294, // (Seconds)
        description: '', // Android Only
        color: 0xFFFFFF, // Android Only - Notification Color
        colorized: true, // Android 8+ Only - Notification Color extracted from the artwork. Set to false to use the color property instead
        date: '1983-01-02T00:00:00Z', // Release Date (RFC 3339) - Android Only
        rating: MusicControl.RATING_THUMBS_UP_DOWN, // Android Only (Boolean or Number depending on the type)
        notificationIcon: 'my_custom_icon' // Android Only (String), Android Drawable resource name for a custom notification icon
    });


    MusicControl.enableBackgroundMode(true);

    // on iOS, pause playback during audio interruptions (incoming calls) and resume afterwards.
    // As of {{ INSERT NEXT VERSION HERE}} works for android aswell.
    MusicControl.handleAudioInterruptions(true);

    MusicControl.on('play', ()=> {
    console.log("play");
    //MusicControl.enableControl('pause', true) ;
    //this.props.dispatch(playRemoteControl());
        MusicControl.updatePlayback({
            state: MusicControl.STATE_PLAYING, // (STATE_ERROR, STATE_STOPPED, STATE_PLAYING, STATE_PAUSED, STATE_BUFFERING)
        });
        Def.startPlay(true);
        if(Def.startPlay_radio)
          Def.startPlay_radio();
    })

    // on iOS this event will also be triggered by audio router change events
    // happening when headphones are unplugged or a bluetooth audio peripheral disconnects from the device
    MusicControl.on('pause', ()=> {
      console.log("pause");
      MusicControl.updatePlayback({
          state: MusicControl.STATE_STOPPED, // (STATE_ERROR, STATE_STOPPED, STATE_PLAYING, STATE_PAUSED, STATE_BUFFERING)
      })
      Def.stopPlay(true);
      if(Def.stopPlay_radio)
        Def.stopPlay_radio();
      //MusicControl.enableControl('play', true);
      //this.props.dispatch(pauseRemoteControl());
  });

  // on iOS this event will also be triggered by audio router change events
  // happening when headphones are unplugged or a bluetooth audio peripheral disconnects from the device
  MusicControl.on('previousTrack', ()=> {
      console.log("previousTrack");
      if(  Def.lastType == Def.TYPE_RADIO){
        if(Def.onPrevRadio)
          Def.onPrevRadio();
        else{
          for(let i = 1; i <Def.lastItemArr.length ; i++ ){
            let currItem = Def.lastItemArr[i];
            let prevItem = Def.lastItemArr[i-1];
            if(currItem.id == Def.lastItem.id){
                this.setState({item:prevItem},()=>{
                    Def.setItemRadio(prevItem,Def.lastItemArr);
                });
                break;
            }
        }
        }
      }else if(  Def.lastType == Def.TYPE_MUSIC){
        if(Def.onPrevMusic)
          Def.onPrevMusic();

      }
  });

  // on iOS this event will also be triggered by audio router change events
  // happening when headphones are unplugged or a bluetooth audio peripheral disconnects from the device
  MusicControl.on('nextTrack', ()=> {
      console.log("nextTrack");
      if(  Def.lastType == Def.TYPE_RADIO){
        if(Def.onNextRadio)
          Def.onNextRadio();
          else{
            console.log("onNext()");
            for(let i = 0; i <Def.lastItemArr.length-1; i++ ){
                let currItem = Def.lastItemArr[i];
                let nextItem = Def.lastItemArr[i+1];
                console.log(`${currItem.id} - ${Def.lastItem.id} - ${i}`);
                if(currItem.id == Def.lastItem.id){
                    console.log(`${currItem.id} - ${Def.lastItem.id} - ${nextItem.id} - ${i}`);
                    this.setState({item:nextItem},()=>{
                        Def.setItemRadio(nextItem,Def.lastItemArr);
                    });
                    break;
                }
            }
          }

      }else if(  Def.lastType == Def.TYPE_MUSIC){
        if(Def.onNextMusic)
          Def.onNextMusic();

      }
      //MusicControl.enableControl('play', true);
      //this.props.dispatch(pauseRemoteControl());
  });


  }
  onAudioFocusChanged(data) {
    console.log(`onAudioFocusChanged ${data}`);
  }
  seek(value) {
    this.player.seek(value, 50);
  }
  pauseVideo(by_schedule = false) {
    if (this.player) {
      this.setState({paused: true});
      Def.global_player_is_stop = true;
    }

    if (by_schedule) {
      if (Def.stopPlay_music) {
        Def.stopPlay_music(false);
      }
      if (Def.stopPlay_radio) {
        Def.stopPlay_radio(false);
      }
    }

    MusicControl.updatePlayback({
        state: MusicControl.STATE_STOPPED, // (STATE_ERROR, STATE_STOPPED, STATE_PLAYING, STATE_PAUSED, STATE_BUFFERING)
    })

    analytics().logEvent('media', {
      action: 'pause',
      url: this.state.url,
    });
  }
  onProgress(data) {
    if (Def.setProgress && data.seekableDuration > 0) {
      Def.setProgress(data.currentTime / data.seekableDuration);
    }

    if(Def.onSlideMusic && data.seekableDuration > 0){

      Def.onSlideMusic(data.currentTime , data.seekableDuration);
    }
  }


  playVideo(url_, newPlay = false) {
    console.log(`playVideo(${url_} = null ${newPlay})`);

    if (this.player) {
      if (url_ != null) {
        if(Def.setProgress)
          Def.setProgress(0);


        this.pauseVideo();
        if (url_ != this.state.url || newPlay) {
          this.setState({url: url_});

          MusicControl.enableControl('play', true);
          MusicControl.enableControl('pause', true) ;
          MusicControl.enableControl('seek', false) // Android only
        }
        this.setState({paused: false});
        Def.global_player_is_stop = false;


          MusicControl.updatePlayback({
              state: MusicControl.STATE_PLAYING
          })
      } else {

        //this.setState({url: url_});
        //this.setState({paused: true});
        //Def.global_player_is_stop = true;

        //MusicControl.updatePlayback({
        //    state: MusicControl.STATE_PAUSED
        //})

      }
    }

    analytics().logEvent('media', {
      action: 'play',
      url: url_,
    });
  }

  scheduleVideo(seconds) {
    console.log(`scheduleVideo ${seconds}`);

    if (this.state.timer || seconds == 0) {
      clearTimeout(this.state.timer);
      Def.schedule = "";
    }

    if (seconds > 0) {
      let timer = setTimeout(this.pauseVideo.bind(this, true), seconds * 1000);
      this.setState({timer: timer});

        let currDate = new Date();
        currDate.setMinutes ( currDate.getMinutes() + parseInt(seconds/60)) ;
        Def.timestampSchedule = Math.round(currDate.getTime()/1000);
        console.log('time stams' + Def.timestampSchedule);
        Def.schedule = Def.getDateString(currDate, "HH:mm:ss");


    }

    analytics().logEvent('schedule', {
      action: 'schedule',
      url: this.state.url,
      duration: seconds,
    });
  }

  videoError(data) {
    this.playVideo(this.state.url);
  }

  onBuffer(data) {
  }

  render() {
    return (
      <NavigationContainer>
          <StatusBar backgroundColor={Style.DEFAUT_RED_COLOR} />
        <Video
          ref={(ref) => {
            this.player = ref;
          }}
          resizeMode={'contain'}
          style={{
            aspectRatio: 1,
            width: '0%',
            borderWidth: 0
          }}
          //controls={true}
          paused={this.state.paused}
          source={{uri: this.state.url}}
          shouldPlay
          //useNativeControls
          playWhenInactive={true}
          playInBackground={true}
          onProgress={this.onProgress}
          onBuffer={this.onBuffer}                // Callback when remote video is buffering
          onError={this.videoError}               // Callback when video cannot be loaded
          onAudioFocusChanged={this.onAudioFocusChanged}
          disableFocus={false}
        />
        <AppDrawer />
      </NavigationContainer>
    );

  }
}
