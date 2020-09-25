import React from 'react'
import {Text, View, Button, TouchableOpacity} from 'react-native'
import {createStackNavigator} from '@react-navigation/stack';

import InteractModal from  './common/modal/InteractModal'
import MenuIcon from '../../assets/icon/menu.svg';
import BackIconSvg from '../../assets/icon/icon-back.svg'
import PlayMusicModal from "./music/modal/PlayMusicModal";
import Style from "../../Def/Style";



const Stack = createStackNavigator();
const RootStack = createStackNavigator();


function MainStack(props) {
    return (
            <Stack.Navigator  >
                <Stack.Screen name="signIn" component={SignInScreen}  options={{
                    title: 'Tv',
                    headerLeft: () => (
                        <TouchableOpacity style={{width: 50, height:50, justifyContent: 'center', paddingLeft:15 ,  alignItems : 'center'}} onPress={() => props.navigation.toggleDrawer()}>
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

                <Stack.Screen name="play" component={PlayTvScreen} title="Play Tv"

                              options={({route }) => ({
                                  title: route.params.name ? route.params.name : 'Play Tv',
                                  headerStyle: {
                                      backgroundColor: Style.DEFAUT_RED_COLOR,
                                      height: Style.HEADER_HEIGHT,
                                  },
                                  headerTintColor: '#ffffff',
                                  headerBackImage: ()=> {
                                      return <BackIconSvg width={26} height={26} />
                                  }
                              })} />




            </Stack.Navigator>
        )

}



class PlayMusicStack extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <RootStack.Navigator  mode='modal' headerMode="none">
                <RootStack.Screen name="playMusic" component={PlayMusicModal} />
                <RootStack.Screen name="commentMusic" component={InteractModal} />
            </RootStack.Navigator>
        )
    }
}

export default PlayMusicStack;
