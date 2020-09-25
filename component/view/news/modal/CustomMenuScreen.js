import React from 'react'
import {View, TouchableOpacity, StyleSheet, Text, FlatList, TextInput, Dimensions, Keyboard,Alert} from 'react-native'
import DownIconSvg from "../../../../assets/icon/icon-down-black.svg";
import GestureRecognizer from "react-native-swipe-gestures";
import HideIcon from "../../../../assets/icon/icon-nodisplay.svg";
import ShowIcon from "../../../../assets/icon/icon-display.svg";

import DraggableFlatList from "react-native-draggable-flatlist";
import Def from "../../../../Def/Def"
import Style from "../../../../Def/Style";
const {width, height} = Dimensions.get('window');

class CustomMenuItem extends React.PureComponent{
    render () {
        return (
            <TouchableOpacity
                style={{
                    height: 60,
                    width: width,
                    justifyContent : 'center',
                }}
                onLongPress={() => {
                    drag();
                }}
            >
                <View style={{paddingHorizontal :10, flex:1, justifyContent:'space-between'}}>
                    <View/>
                    <View style={{flexDirection:'row', alignItems:'center' }}>
                        <TouchableOpacity style={{width:30, height : 30, justifyContent : 'center', alignItems : 'center' }}

                        >
                            <HideIcon width={25} height={25}/>
                        </TouchableOpacity>
                        <Text
                            style={{
                                fontSize: Style.MIDLE_SIZE,
                                marginLeft: 30
                            }}
                        >
                            {item["name_vi"]}
                        </Text>
                    </View>
                    <View style={{height:2, width: width-20 , backgroundColor: '#b3b3b3', }}>

                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

class CustomMenuScreen extends React.Component{

    constructor(props){
        super(props);
        if(!Def.config_news_menu){
            Def.config_news_menu = this.createConfigData();
        }


        this.state = {
            data: Def.config_news_menu
        };
        this.updateMenuItem = this.updateMenuItem.bind(this);

    }

    createConfigData(){
        if(Def.news_data){
           let configData =  Object.entries(Def.news_data).map((prop, key) => {
               return {key: prop[0],name_vi:prop[1]["name_vi"], hidden:0, data:prop[1]["data"]};
            });
            return configData;
        }

    }

    updateMenuItem(item){
        let newData= this.state.data;
        newData[item]["hidden"] = newData[item]["hidden"] == 1 ? 0 : 1  ;
        this.setState({data:newData});
        Def.config_news_menu = this.state.data;
    }



    render() {
        return (
            <View style={{flex:1}}>
                <View style={styles.header}>
                    <TouchableOpacity style={{justifyContent:'center',  paddingLeft: 10, width:50}}
                                      onPress={() => {
                                          Def.config_news_menu = this.state.data;
                                          this.props.navigation.navigate('News',{screen:'news', params:{sortData:this.state.data}});
                                      }}
                    >
                        <DownIconSvg width={25} height={25} />
                    </TouchableOpacity>
                    <View style={{alignItems:'center', justifyContent: 'center', marginLeft: 30}}>
                        <Text style={styles.title}>
                            {'Chuyên mục'}
                        </Text>
                    </View>

                </View>

                    <DraggableFlatList
                        data={this.state.data}
                        renderItem={({ item, index, drag, isActive }) => {
                            return (
                                <TouchableOpacity
                                    style={{
                                        height: 60,
                                        width: width,
                                        justifyContent : 'center',
                                    }}
                                    onLongPress={() => {
                                        drag();
                                    }}
                                >
                                    <View style={{paddingHorizontal :10, flex:1, justifyContent:'space-between'}}>
                                        <View/>
                                        <View style={{flexDirection:'row', alignItems:'center' }}>
                                            <TouchableOpacity style={{width:30, height : 30, justifyContent : 'center', alignItems : 'center' }}
                                                              onPress={() => {this.updateMenuItem(index)}}
                                            >

                                                {item["hidden"] == 1 ?
                                                <HideIcon width={25} height={25}/>:
                                                <ShowIcon width={25} height={25}/>
                                                }

                                            </TouchableOpacity>
                                            <Text
                                                style={{
                                                    fontSize: Style.MIDLE_SIZE,
                                                    marginLeft: 30
                                                }}
                                            >
                                                {item["name_vi"]}
                                            </Text>
                                        </View>
                                        <View style={{height:2, width: width-20 , backgroundColor: '#b3b3b3', }}>

                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                        keyExtractor={(item, index) => `draggable-item-${index}`}
                        onDragEnd={({ data }) => {
                            this.setState({ data });
                            Def.config_news_menu = this.state.data;
                        }}
                    />
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
        borderBottomWidth:1,
        borderBottomColor : '#b3b3b3'
        // flex:1,


    },
    title:{
        fontSize: Style.TITLE_SIZE,
        color: Style.DEFAUT_RED_COLOR,
        fontWeight: 'bold',
        marginLeft: -20,
    },

});

export default CustomMenuScreen;
