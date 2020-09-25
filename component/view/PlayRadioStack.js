import React from 'react'
import {Text, View, Button, TouchableOpacity} from 'react-native'
import {createStackNavigator} from '@react-navigation/stack';

import PlayRadioModal from './radio/modal/PlayRadioModal'
import InteractModal from './radio/modal/InteractModal'

import MenuIcon from '../../assets/icon/menu.svg';
import BackIconSvg from '../../assets/icon/icon-back.svg'
import FeedbackModal from "./common/modal/FeedBackModal";
import ShutdownAlarmModal from "./radio/modal/ShutDownAlarmModal";
import PlaybackModal from "./radio/modal/PlaybackModal";
import RadioPlayBackModal from  "./radio/modal/RadioPlayBackModal"


import Style from "../../Def/Style";

const Stack = createStackNavigator();
const RootStack = createStackNavigator();


function MainStack(props) {
    return (
            <Stack.Navigator  >
                <Stack.Screen name="signIn" component={SignInScreen}  options={{
                    title: 'Tv',
                    headerLeft: () => (
                        <TouchableOpacity style={{width: 40, height:40, justifyContent: 'center', paddingLeft:15 ,  alignItems : 'center'}} onPress={() => props.navigation.toggleDrawer()}>
                            <MenuIcon
                                width="30"
                                height="30"
                            />
                        </TouchableOpacity>

                    ),
                    headerStyle: {
                        backgroundColor: Style.DEFAUT_RED_COLOR,
                        height: 50,
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }} />

                <Stack.Screen name="play" component={PlayTvScreen} title="Play Tv"

                              options={({route }) => ({
                                  title: route.params.name ? route.params.name : 'Play Tv',
                                  headerStyle: {
                                      backgroundColor: Style.DEFAUT_RED_COLOR,
                                      height: 50,
                                  },
                                  headerTintColor: '#ffffff',
                                  headerBackImage: ()=> {
                                      return <BackIconSvg width={26} height={26} />
                                  }
                              })} />




            </Stack.Navigator>
        )

}


class PlayRadioStack extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <RootStack.Navigator  mode='modal' headerMode="none">
                <Stack.Screen name="commonPlayRadio" component={PlayRadioModal} />
                <Stack.Screen name='commonInteract' component={InteractModal}/>
                <RootStack.Screen name='feedback' component={FeedbackModal}/>
                <RootStack.Screen name='shutdownAlarm' component={ShutdownAlarmModal}/>
                <RootStack.Screen name='playback' component={PlaybackModal}/>
                <RootStack.Screen name='radioPlayBack' component={RadioPlayBackModal}/>
            </RootStack.Navigator>
        )
    }
}

export default PlayRadioStack;
