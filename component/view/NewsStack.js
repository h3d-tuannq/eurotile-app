import React from 'react'
import {Text, View, Button, TouchableOpacity} from 'react-native'
import {createStackNavigator} from '@react-navigation/stack';

import NewsScreen from './news/NewsScreen';
import NewDetail from './news/NewsDetailScreen'

import MenuIcon from '../../assets/icon/menu.svg';
import BackIconSvg from '../../assets/icon/icon-back.svg'
import Style from "../../Def/Style";

const Stack = createStackNavigator();

class NewsStack extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        const {navigation} = this.props;
        return (
            <Stack.Navigator  >
                <Stack.Screen name="news" component={NewsScreen}  options={{
                    title: 'Tin tức',
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

                <Stack.Screen name="newsDetail" component={NewDetail} title="Chi tiết"
                      options={({route }) => ({
                          title: route.params.name ? route.params.name : "Chi tiết",
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

            </Stack.Navigator>
        )
    }
}

export default NewsStack;
