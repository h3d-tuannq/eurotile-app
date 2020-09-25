import React from 'react'
import {Text, View, Button, TouchableOpacity} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import RadioScreen from './radio/RadioScreen';
import ChanelScreen from './radio/ChanelScreen';
import MenuIcon from '../../assets/icon/menu.svg';
import BackIconSvg from '../../assets/icon/icon-back.svg'
import DownIconSvg from '../../assets/icon/icon-down-black.svg'


import PlayRadioModal from './radio/modal/PlayRadioModal'
import InteractModal from './radio/modal/InteractModal'
import FeedbackModal from './common/modal/FeedBackModal'
import ShutdownAlarmModal from './radio/modal/ShutDownAlarmModal'
import PlaybackModal from './radio/modal/PlaybackModal'
import Style from "../../Def/Style";

const Stack = createStackNavigator();
const RootStack = createStackNavigator();

function MainStack(props) {
    return (
        <Stack.Navigator  >
            <Stack.Screen name="Radio" component={RadioScreen}  options={{
                title: 'Radio',
                headerLeft: () => (
                    <TouchableOpacity
                        style=  {
                            {
                                width: 40,
                                height:40,
                                justifyContent: 'center',
                                paddingLeft:15 ,
                                alignItems : 'center'
                            }
                        }
                        onPress={() => props.navigation.toggleDrawer()}>
                        <MenuIcon
                            width="30"
                            height="30"
                        />
                    </TouchableOpacity>

                ),
                headerStyle: {
                    backgroundColor: Style.DEFAUT_RED_COLOR,
                    height: Style.HEADER_HEIGHT,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }} />

            <Stack.Screen name="Chanel" component={ChanelScreen} title="Radio Title"
                          options={({route }) => ({
                              title: route.params.name ? route.params.name : "Chanel",
                              data: route.params.data,
                              headerStyle: {
                                  backgroundColor: Style.DEFAUT_RED_COLOR,
                                  height: Style.HEADER_HEIGHT,
                              },
                              headerTintColor: '#ffffff',
                              headerBackImage: ()=> {
                                  return <BackIconSvg width={26} height={26} />
                              }
                          })}
            />
            {/*<Stack.Screen name="player" component={PlayRadioModal} title="player"*/}
                          {/*options={({route }) => ({*/}
                              {/*title:  "Player-Chanel",*/}
                              {/*headerStyle: {*/}
                                  {/*backgroundColor: '#ffffff',*/}
                                  {/*// height: 70,*/}
                              {/*},*/}
                              {/*headerTintColor: '#000000',*/}
                              {/*headerTitleStyle: {*/}
                                  {/*alignSelf: 'center',*/}
                                  {/*paddingRight : 30*/}
                              {/*},*/}
                              {/*headerBackImage: ()=> {*/}
                                  {/*return <DownIconSvg width={26} height={26} />*/}
                              {/*}*/}
                          {/*})}*/}
            {/*/>*/}
        </Stack.Navigator>
    )
}

class RadioStack extends React.Component {
    constructor(props){
        super(props);
        this.state = {  radioTitle:'Radio', chanelTitle:'Chanel'};
    }

    render() {
        return (
            <RootStack.Navigator mode='modal' headerMode="none">
                <RootStack.Screen name='main' component={MainStack}/>
                {/*<RootStack.Screen name='player' component={PlayRadioModal}/>*/}
                {/*<RootStack.Screen name='interact' component={InteractModal}/>*/}
                {/*<RootStack.Screen name='feedback' component={FeedbackModal}/>*/}
                {/*<RootStack.Screen name='shutdownAlarm' component={ShutdownAlarmModal}/>*/}
                {/*<RootStack.Screen name='playback' component={PlaybackModal}/>*/}
            </RootStack.Navigator>
        )
    }
}

export default RadioStack;
