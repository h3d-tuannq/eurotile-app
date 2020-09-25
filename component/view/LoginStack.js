import React from 'react'
import {Text, View, Button, TouchableOpacity} from 'react-native'
import {createStackNavigator} from '@react-navigation/stack';

import SignInScreen from './user/SignIn'
import SignUpScreen from './user/SignUp'
import ForgetPassScreen from './user/ForgetPassword'

import MenuIcon from '../../assets/icon/menu.svg';
import BackIconSvg from '../../assets/icon/icon-back.svg'
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
                                      // height: 70,
                                  },
                                  headerTintColor: '#ffffff',
                                  headerBackImage: ()=> {
                                      return <BackIconSvg width={26} height={26} />
                                  }
                              })} />




            </Stack.Navigator>
        )

}



class LoginStack extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <RootStack.Navigator  mode='modal' >
                {/*<RootStack.Screen name="mainTv" component={MainStack} />*/}
                <RootStack.Screen name="signIn" component={SignInScreen} options={{
                    title: 'Đăng nhập',
                    // headerLeft: () => (
                    //     <TouchableOpacity
                    //         style=  {
                    //             {
                    //                 width: 40,
                    //                 height:40,
                    //                 justifyContent: 'center',
                    //                 paddingLeft:15 ,
                    //                 alignItems : 'center'
                    //             }
                    //         }
                    //         onPress={() => this.props.navigation.toggleDrawer()}>
                    //         <MenuIcon
                    //             width="30"
                    //             height="30"
                    //         />
                    //     </TouchableOpacity>
                    //
                    // ),
                    headerStyle: {
                        backgroundColor: Style.DEFAUT_RED_COLOR,
                        height: Style.HEADER_HEIGHT,
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerBackImage: ()=> {
                        return <BackIconSvg width={26} height={26} />
                    }
                }} />
                <RootStack.Screen name="signUp" component={SignUpScreen}
                                  options={{
                                      title: 'Đăng ký',
                                      // headerLeft: () => (
                                      //     <TouchableOpacity
                                      //         style=  {
                                      //             {
                                      //                 width: 40,
                                      //                 height:40,
                                      //                 justifyContent: 'center',
                                      //                 paddingLeft:15 ,
                                      //                 alignItems : 'center'
                                      //             }
                                      //         }
                                      //         onPress={() => this.props.navigation.toggleDrawer()}>
                                      //         <MenuIcon
                                      //             width="30"
                                      //             height="30"
                                      //         />
                                      //     </TouchableOpacity>
                                      //
                                      // ),
                                      headerStyle: {
                                          backgroundColor: Style.DEFAUT_RED_COLOR,
                                          height: Style.HEADER_HEIGHT,
                                      },
                                      headerTintColor: '#fff',
                                      headerTitleStyle: {
                                          fontWeight: 'bold',
                                      },
                                      headerBackImage: ()=> {
                                          return <BackIconSvg width={26} height={26} />
                                      }
                                  }}
                />
                <RootStack.Screen name="forgetPass" component={ForgetPassScreen}
                                  options={{
                                      title: 'Quên mật khẩu',
                                      // headerLeft: () => (
                                      //     <TouchableOpacity
                                      //         style=  {
                                      //             {
                                      //                 width: 40,
                                      //                 height:40,
                                      //                 justifyContent: 'center',
                                      //                 paddingLeft:15 ,
                                      //                 alignItems : 'center'
                                      //             }
                                      //         }
                                      //         onPress={() => this.props.navigation.toggleDrawer()}>
                                      //         <MenuIcon
                                      //             width="30"
                                      //             height="30"
                                      //         />
                                      //     </TouchableOpacity>
                                      //
                                      // ),
                                      headerStyle: {
                                          backgroundColor: Style.DEFAUT_RED_COLOR,
                                          height: Style.HEADER_HEIGHT,
                                      },
                                      headerTintColor: '#fff',
                                      headerTitleStyle: {
                                          fontWeight: 'bold',
                                      },
                                      headerBackImage: ()=> {
                                          return <BackIconSvg width={26} height={26} />
                                      }
                                  }}

                />

            </RootStack.Navigator>
        )
    }
}

export default LoginStack;
