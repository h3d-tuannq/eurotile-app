import React, {PureComponent} from 'react'
import {Text, View, Button, StyleSheet, Dimensions, ScrollView, FlatList, TouchableOpacity} from 'react-native'
import ShareIcon from "../../../assets/icon/icon-share.svg";
import SpeakerIcon from "../../../assets/icon/icon-speaker-around.svg";
import SpeakerDisableIcon from "../../../assets/icon/icon-speaker-around-disable.svg";
import { WebView } from 'react-native-webview';
import Def from '../../../Def/Def'

import analytics from '@react-native-firebase/analytics';
import admob, { MaxAdContentRating ,BannerAd, BannerAdSize, TestIds} from '@react-native-firebase/admob';
import Style from "../../../Def/Style";
const {width, height} = Dimensions.get('window');


const PROGRAM_IMAGE_WIDTH = (width - 30-8) /2
const PROGRAM_IMAGE_HEIGHT = (width - 30-8) /2



class NewsDetailScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {'model':this.props.route.params.model};
        console.log("class NewsDetailScreen extends React.Component");
        console.log(this.props.route.params.item);
        this.onClickNews = this.onClickNews.bind(this);
    }

    onClickNews(){
        console.log("onClickNews");
        const model = this.props.route.params.item;
        if(model.reader_link)
            Def.setItemNews(model);
    }
    render() {
        const {navigation} = this.props;
        const model = this.props.route.params.item;

        analytics().setCurrentScreen(Def.DETAIL_WEB);
        return (
            <View style={styles.container}>

                  {/*<View style={styles.ads}>*/}
                        {/*<BannerAd*/}
                            {/*unitId={TestIds.BANNER}*/}
                            {/*size={BannerAdSize.FULL_BANNER}*/}
                            {/*requestOptions={{*/}
                                {/*requestNonPersonalizedAdsOnly: true,*/}
                            {/*}}*/}
                            {/*onAdLoaded={() => {*/}
                                {/*console.log('Advert loaded');*/}
                            {/*}}*/}
                            {/*onAdFailedToLoad={(error) => {*/}
                                {/*console.error('Advert failed to load: ', error);*/}
                            {/*}}*/}
                            {/*/>*/}

                {/*</View>*/}
                <View style={{marginTop : 5, marginBottom : 10 }}>
                    {
                        /*
                        <Text style={styles.titleText}>
                        {model.title}
                    </Text>
                        */

                    }
                    <View style={styles.webView}>
                        <WebView
                            source={{ uri:model.link }}
                        />
                    </View>
                </View>
                    <TouchableOpacity style={styles.listenButton}>
                        {
                            model.reader_link ? <SpeakerIcon style={styles.favoriteIcon}  /> : <SpeakerDisableIcon style={styles.favoriteIcon}  />
                        }

                    </TouchableOpacity>



            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex : 1,
      paddingLeft: 15,
      // justifyContent: 'flex-start',
       paddingVertical : 5,
      // marginBottom : 60,
        backgroundColor : '#fff'

    },
    slider: {
      justifyContent: 'center',
      paddingTop: 5,
      padding: 8,
      height: 100,
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
    titleText : {
        fontSize :Style.TITLE_SIZE,
        fontWeight:'bold'
    },
    nomarText: {
      color: '#b3b3b3',
      fontSize : 15,
    },

    groupMenu: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop : 5,
        paddingBottom:5,
        marginRight: 15,


    },
    menuBtn:{
        flexDirection : 'row',
        alignItems:'center'

    }
    ,
    menuText: {
        fontSize:15,
        marginHorizontal:5,
        color: '#b3b3b3'
    },
    content : {
        marginTop : 10,
        marginRight: 15,
    },
    webView : {
        height : height * 0.8,
        backgroundColor: '#e6e6e6',
        marginRight: 15,
    },
    // listenView: {
    //     flexDirection: 'row',
    //     height : 45,
    //     marginRight : 10,
    // },
    listenButton :{
        // alignItems: 'center', flexDirection:'row' ,
        // paddingHorizontal: 10,
        // borderRadius: 5,
        // flex: 1,
        position : 'absolute',
        bottom :20,
        right : 30,
        zIndex : 3,
    },
    buttonText : {
        fontSize : 20,
        color: '#ffffff',
        paddingHorizontal: 5,
    },
    favoriteIcon : {
        width : 50,
        height : 50,
    },
    ads: {
       width : width,
       height : 70,
       justifyContent: "center",
       alignItems: "center",
    },



  });

export default NewsDetailScreen;
