import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, FlatList} from 'react-native'
import DownIconSvg from '../../../assets/icon/icon-down-black.svg'
import Style from "../../../Def/Style";


const {width, height} = Dimensions.get('window');


class GuideScreen extends React.Component{
    render() {
        return (
            <View style={{flex:1}}>
                <View style={styles.header}>
                    <TouchableOpacity style={{justifyContent:'center',  paddingLeft: 10, width:50}}
                                      onPress={() => {
                                          this.props.navigation.goBack();
                                      }}
                    >
                        <DownIconSvg width={25} height={25} />
                    </TouchableOpacity>
                    <View style={{alignItems:'center', justifyContent: 'center', marginLeft: 30}}>
                        <Text style={styles.title}>
                            {'Hướng dẫn sử dụng' }
                        </Text>
                    </View>

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        height :Style.HEADER_HEIGHT,
        flexDirection:'row',
        paddingVertical: 10,
        width: width,
        // flex:1,


    },
    carousel: {
        paddingTop: 5,
        padding: 8,
        height: width*1,
        borderRadius: 5,
        backgroundColor: "#e6e6e6",
        marginHorizontal : 10,
        marginTop: 10,
        justifyContent:'center',

    },
    cardStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: width-20,
        height: width,
    },
    textSlide:{
        marginTop:20,
        height:50,
        borderRadius: 10,
        width: width -20,
        marginHorizontal: 10,
        backgroundColor: '#1288c9',
        justifyContent:'center',
        paddingHorizontal:5,
        alignItems: 'center',

    },


    playerContainer: {
        marginTop:80,
        marginHorizontal:10,
        paddingHorizontal: 5,
    },
    title:{
        fontSize: Style.TITLE_SIZE,
        color: Style.DEFAUT_RED_COLOR,
        fontWeight: 'bold',
        marginLeft: -20,
    },
    groupMenu: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop : 10,
        paddingBottom:5

    },
    menuBtn:{
        flexDirection : 'row',
        alignItems:'center'

    },
    menuText: {
        fontSize:Style.MIDLE_SIZE,
        marginHorizontal:5,
    },
    player: {
        // height : 100,
    },
    commentBtn: {
        height:50,
        borderTopLeftRadius : 20,
        borderTopRightRadius : 20,
        backgroundColor : '#01a54e',
        marginHorizontal: 10,
        marginVertical : 10,
        // alignItems : 'center',
        justifyContent : 'center',
        paddingLeft: 20,
    }



});

export default GuideScreen;
