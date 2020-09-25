import React from 'react'
import {Text, View, Button, StyleSheet, Dimensions, ScrollView, FlatList} from 'react-native'
import ProgramItemrenderer from '../item-render/ProgramItemrenderer'
import ScrollableTabView, { ScrollableTabBar,DefaultTabBar  }  from 'react-native-scrollable-tab-view';
import NewsTab from './NewsTab'
import MyCustomizeTabBar from  './tabbar/MyCustomizeTabBar'

import NetNews from '../../../Net/NetNews'
import Def from '../../../Def/Def'

const {width, height} = Dimensions.get('window');


const PROGRAM_IMAGE_WIDTH = (width - 30-8) /2
const PROGRAM_IMAGE_HEIGHT = (width - 30-8) /2

class NewsScreen extends React.Component {


    state = {
        news_data: Def.news_data,
        stateCount: 0.0,
        configMenu: Def.config_news_menu
    };

    constructor(props){
        super(props);
        console.log("Def.news", JSON.stringify(Def.news_data));
        this.onNewsSuccess     = this.onNewsSuccess.bind(this);
        this.onNewsFailed     = this.onNewsFailed.bind(this);
        this.formatText    = this.formatText.bind(this);
        this.refresh     = this.refresh.bind(this);

        Def.mainNavigate = this.props.navigation;

        if(!Def.news_data)
            NetNews.listNews(this.onNewsSuccess,this.onNewsFailed);
        else if (!Def.config_news_menu){
            Def.config_news_menu = this.createConfigData(Def.news_data);
            // this.setState({ configMenu: Def.config_news_menu});
        }
    }

    refresh()
    {
        //NetChannel.listChannel(this.onChannelSuccess,this.onChannelFailed);
        this.setState({ stateCount: Math.random() });
    }

    onNewsSuccess(data){
        console.log("onNewsSuccess");
        // console.log(Object.entries(data["data"]));
        Object.entries(data["data"]).map((prop, key) => {
            console.log(prop[0]);
            console.log(prop[1]["data"]);
        });
        this.setState({ news_data: data["data"] });
        Def.config_news_menu = this.createConfigData(data["data"]) ;
        this.setState({ configMenu: Def.config_news_menu});
    }

    createConfigData(data){
        if(data){
            let configData =  Object.entries(data).map((prop, key) => {
                return {key: prop[0],name_vi:prop[1]["name_vi"], hidden:0, data:prop[1]["data"]};
            });
            return configData;
        }

    }

    onNewsFailed(data){
        //console.log(data);
    }

    formatText(text){
        let rs = text;
        if(text.length > 10){
            rs = text.substring(0, 15) ;
        }
        return rs;
    }

    shouldComponentUpdate(){
        // this.setState({ configMenu: Def.config_news_menu});
        // console.log('SortData ddd:' + JSON.stringify(this.props.route));
        return true;
    }

    getNewDataByConfigKey(key){

    }


    render() {
        const {navigation} = this.props;
        const configMenu = Def.config_news_menu;
        return (
            <ScrollableTabView renderTabBar={() => <MyCustomizeTabBar navigation={navigation} />}  >

                {
                    this.state.news_data && configMenu &&Object.entries(configMenu).map((prop, key) => {
                        console.log(key + " Props " + JSON.stringify(prop))
                        if((prop[1]["hidden"]) == 0){
                            return (
                                <NewsTab key ={prop[0]}  navigation={navigation} refresh={this.refresh} tabLabel={this.formatText(prop[1]["name_vi"])} title={this.formatText(prop[1]["name_vi"])} data={prop[1]["data"]}  />
                            );
                        }
                    })
                }
            </ScrollableTabView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex : 1,
        paddingLeft: 15,
        // justifyContent: 'flex-start',
        // marginVertical : 5,
        marginBottom : 125,
        backgroundColor: '#fff'
    },
    slider: {
        justifyContent: 'center',
        paddingTop: 5,
        padding: 8,
        height: 120,
        borderRadius: 5,
        backgroundColor: "#e6e6e6",
        marginRight : 15
    },
    cardStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: width-20,
        height: width/2,

    },
    programListStyle : {

    },
    itemImage: {
        width: PROGRAM_IMAGE_WIDTH -5,
        height : PROGRAM_IMAGE_HEIGHT -5,
        borderRadius: 5,
    },
});

export default NewsScreen;
