import React from 'react'
import {Text, View, Button, TouchableOpacity} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from './my/HomeScreen';
import MyFavoriteScreen from './my/MyFavoriteScreen'
import MenuIcon from '../../assets/icon/menu.svg';
import BackIcon from '../../assets/icon/icon-back.svg.png'
import BackIconSvg from '../../assets/icon/icon-back.svg'
import Style from '../../Def/Style'


const Stack = createStackNavigator();

class MyStack extends React.Component {
    constructor(props){
        super(props);
        this.state = {homeTitle:'Home', favoriteTitle:'Favorite'};
    }

    render() {
        const {navigation} = this.props;
        return (
            <Stack.Navigator  >
                <Stack.Screen name="Home" component={HomeScreen}  options={{
                    title: 'Cá nhân',
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
                            onPress={() => navigation.toggleDrawer()}>
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

                <Stack.Screen name="Favorite" component={MyFavoriteScreen} title="Radio Title"
                              options={({route }) => ({
                                    title: route.params.name + ' yêu thích',
                                    data: route.params.data,
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
}

export default MyStack;
