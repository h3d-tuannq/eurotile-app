import React from 'react'
import {Text, View, Button, TouchableOpacity} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import MusicScreen from './music/MusicScreen';
import MusicChanelScreen from './music/MusicChanelScreen'
import PlayMusicModal from './music/modal/PlayMusicModal'
import InteractModal from  './common/modal/InteractModal'

import MenuIcon from '../../assets/icon/menu.svg';
import BackIconSvg from '../../assets/icon/icon-back.svg'
import Style from "../../Def/Style";



const Stack = createStackNavigator();
const RootStack = createStackNavigator();

function MainStack(props) {
    return (<Stack.Navigator  >
        <Stack.Screen name="music" component={MusicScreen}  options={{
            title: 'Âm nhạc',
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

        <Stack.Screen name="MusicChanel" component={MusicChanelScreen} title="Play Tv"
                      options={({route }) => ({
                          title: route.params.name,
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

    </Stack.Navigator>);
}

class MusicStack extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        const {navigation} = this.props;
        return (
            <RootStack.Navigator mode='modal' headerMode="none" >
                <RootStack.Screen name="mainMs" component={MainStack} />
                <RootStack.Screen name="playMusic" component={PlayMusicModal} />
                <RootStack.Screen name="commentMusic" component={InteractModal} />
            </RootStack.Navigator>
        )
    }
}

export default MusicStack;
