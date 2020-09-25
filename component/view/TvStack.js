import React from 'react'
import {Text, View, Button, TouchableOpacity} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import TvScreen from './tv/TvScreen';
import PlayTvScreen from './tv/PlayTvScreen'
import TVModal from './tv/TVModal'
import FeedBackModal from './common/modal/FeedBackModal'

import MenuIcon from '../../assets/icon/menu.svg';
import BackIconSvg from '../../assets/icon/icon-back.svg'
import Style from "../../Def/Style";

const Stack = createStackNavigator();
const RootStack = createStackNavigator();


function MainStack(props) {
    return (
            <Stack.Navigator  >
                <Stack.Screen name="tv" component={TvScreen}  options={{
                    title: 'Tv',
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

            <Stack.Screen name="tvmodal" component={TVModal}  
            
          
            title="tvmodal"

            options={({route }) => ({
                header: null,
                title: route.params.name ? route.params.name : 'tvmodal',
                item:route.params.item,
                headerShown: false,
                headerTintColor: '#ffffff'
            })} />

            <Stack.Screen name="play" component={PlayTvScreen}  title="Play Tv"

            options={({route }) => ({

                title: route.params.name ? route.params.name : 'Play Tv',
                item:route.params.item,
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



class TvStack extends React.Component {
    constructor(props){
        super(props);
        console.log("class TvStack extends React.Component");
        //console.log(props);
    }

    render() {
        const {navigation} = this.props;
        return (
            <RootStack.Navigator  mode='modal' headerMode="none">
                <RootStack.Screen name="mainTv" component={MainStack} />
                <RootStack.Screen name="feedBackTv" component={FeedBackModal} />

            </RootStack.Navigator>
        )
    }
}

export default TvStack;
