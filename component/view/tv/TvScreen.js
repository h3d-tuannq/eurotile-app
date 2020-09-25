import React from 'react'
import {Text, View, Button, StyleSheet, Dimensions, ScrollView, FlatList} from 'react-native'
import ProgramItemrenderer from '../item-render/ProgramItemrenderer'

import NetChannel from '../../../Net/NetChannel'
import Def from '../../../Def/Def'
import AsyncStorage  from '@react-native-community/async-storage'

import admob, { MaxAdContentRating ,BannerAd, BannerAdSize, TestIds} from '@react-native-firebase/admob';

const {width, height} = Dimensions.get('window');


const PROGRAM_IMAGE_WIDTH = (width - 30) /2
const PROGRAM_IMAGE_HEIGHT = (width - 30) /2






class TvScreen extends React.Component {
    state = {
        data: Def.channels_data_tv,
        stateCount: 0.0
    };

    constructor(props){
        super(props);

        this.onChannelSuccess     = this.onChannelSuccess.bind(this);
        this.onChannelFailed     = this.onChannelFailed.bind(this);
        this.refresh     = this.refresh.bind(this);
        this.itemClick = this.itemClick.bind(this);
        this.renderItem     = this.renderItem.bind(this);
        Def.mainNavigate = this.props.navigation;

        if(!Def.channels_data_tv)
            NetChannel.listChannel(this.onChannelSuccess,this.onChannelFailed);
        this.getAdsSize = this.getAdsSize.bind(this);

    }

    renderItem = ({ item }) => (
        <ProgramItemrenderer  refresh={this.refresh}  screen={'play'} click={() =>this.itemClick(item)} item={item} favorite={true} styleImage={{width:PROGRAM_IMAGE_WIDTH -2, height:PROGRAM_IMAGE_HEIGHT-5, marginRight:6, marginBottom : 5 }} />
    );



    refresh()
    {
        console.log("================");
        console.log("TvScreen refresh");
        this.setState({ stateCount: Math.random() });
    }


    onChannelSuccess(data){
        console.log("onChannelSuccess");
        ////console.log(data);

        this.setState({ data: data["data"]["TV"] });
        Def.channels_data_radio = data["data"]["Radio"];
        Def.channels_data_tv = data["data"]["TV"];

        AsyncStorage.setItem('channels_data_radio', JSON.stringify(Def.channels_data_radio));
        AsyncStorage.setItem('channels_data_tv', JSON.stringify(Def.channels_data_tv));
    }

    onChannelFailed(data){
        //console.log(data);
    }

    itemClick(item){
        console.log(item.id);
        this.props.navigation.navigate('play', {item:item});

    }
    getAdsSize(){
        let widthh = Math.floor(width - 25);
        let heighth = 70;
        let rs = (widthh.toString()+ "x" + heighth.toString()).toString();
        return rs;

    }



    render() {
        const {navigation} = this.props;
        return (
            <View style={styles.container}>

                  <View style={styles.ads}>
                        <BannerAd
                            unitId={TestIds.BANNER}
                            size={this.getAdsSize()}
                            requestOptions={{
                                requestNonPersonalizedAdsOnly: true,
                            }}
                            onAdLoaded={() => {
                                console.log('Advert loaded');
                            }}
                            onAdFailedToLoad={(error) => {
                                console.error('Advert failed to load: ', error);
                            }}
                            />
                </View>
                <View style={{marginTop : 20}}>
                    {   this.state.data &&
                        <FlatList

                        data={this.state.data}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.id}
                        showsHorizontalScrollIndicator={false}
                        numColumns={2}

                    />
                    }
                </View>

            </View>


        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex : 1,
        paddingHorizontal: 15,
        // justifyContent: 'flex-start',
        // marginVertical : 5,
        // marginBottom : 125,
        backgroundColor: '#fff',
        paddingTop: 5,
    },
    slider: {
        justifyContent: 'center',
        paddingTop: 5,
        paddingLeft: 5,
        paddingRight: 5,

        height: 80,
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
    ads: {
       width : width,
       height : 70,
        marginRight: 5,
    },
});

export default TvScreen;
