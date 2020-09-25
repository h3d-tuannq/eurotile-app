import React, {PureComponent} from 'react'
import {Text, View, StyleSheet, Dimensions,TouchableOpacity} from 'react-native'
import ProgramHozList from '../common/ProgramHozList'
import ProgramVerList from "../common/ProgramVerList";
import ProgramItemrenderer from "../item-render/ProgramItemrenderer"
import IconArrow from "../../../assets/icon/icon_arrow.svg";
import NetChannel from '../../../Net/NetChannel'
import NetProgram from '../../../Net/NetProgram'
import NetNews from '../../../Net/NetNews'
import Def from '../../../Def/Def'
import AsyncStorage  from '@react-native-community/async-storage'

import admob, { MaxAdContentRating ,BannerAd, BannerAdSize, TestIds} from '@react-native-firebase/admob';
import Style from "../../../Def/Style";

const {width, height} = Dimensions.get('window');
const PROGRAM_IMAGE_WIDTH = (width - 60) /2.5
const PROGRAM_IMAGE_HEIGHT = (width - 60) /2.5

const headerHeight = 60;


const renderItem = ({ item }) => (
    <ProgramItemrenderer favorire={true} item={item} styleImage={{width:PROGRAM_IMAGE_WIDTH-5, height:PROGRAM_IMAGE_HEIGHT-5 }} />
);


class RadioScreen extends React.Component {

    amount = 5;
    offset = 0;
    requesting = false;

    state = {
        channels_data_radio: Def.channels_data_radio,
        program_data: [],
        stateCount: 0.0,
        first: true
    };

    constructor(props){
        super(props);
        this.onChannelSuccess     = this.onChannelSuccess.bind(this);
        this.onChannelFailed     = this.onChannelFailed.bind(this);
        this.onFeatureSuccess         = this.onFeatureSuccess.bind(this);
        this.onFeatureFailed          = this.onFeatureFailed.bind(this);
        this.getAdsSize = this.getAdsSize.bind(this);

        this.endListReach = this.endListReach.bind(this);

        Def.mainNavigate = this.props.navigation;

        this.refresh     = this.refresh.bind(this);

        AsyncStorage.getItem("last_channel").then((last_channel) => {
            if (last_channel){
                AsyncStorage.getItem("last_all_radio").then((last_all_radio) => {
                    if (last_all_radio){
                        Def.setItemRadio(JSON.parse(last_channel),JSON.parse(last_all_radio),true);
                    }
                }).done();
            }

            AsyncStorage.getItem("login_token").then((value) => {
                if (value){
                  Def.login_token = value;
                }

                NetChannel.listChannel(this.onChannelSuccess,this.onChannelFailed);
                this.requesting = true;
                NetProgram.listFeaturePrograms(this.onFeatureSuccess,this.onFeatureFailed,this.amount,this.offset);
                NetNews.listNews(this.onNewsSuccess,this.onNewsFailed);
            });

        }).done();





        AsyncStorage.getItem("music_data").then((value) => {
            if (value){
                Def.music_data = JSON.parse(value) ;
            }
        }).done();

        AsyncStorage.getItem("news_data").then((value) => {
            if (value){
                Def.news_data = JSON.parse(value) ;
            }
        }).done();

        AsyncStorage.getItem("program_data").then((value) => {
            if (value){
                //Def.program_data = JSON.parse(value) ;
            }
        }).done();


        AsyncStorage.getItem("channels_data_radio").then((value) => {
            if (value){
                Def.channels_data_radio = JSON.parse(value) ;
            }
        }).done();
        AsyncStorage.getItem("channels_data_tv").then((value) => {
            if (value){
                Def.channels_data_tv = JSON.parse(value) ;
            }
        }).done();



        AsyncStorage.getItem("channels_data_fav").then((value) => {
            if (value){
                Def.channels_data_fav = JSON.parse(value) ;
                this.setState({ channels_data_fav: Def.channels_data_fav})
            }
        }).done();

        /*
        AsyncStorage.getItem("music_data_fav").then((value) => {
            if (value){
                Def.music_data_fav = JSON.parse(value) ;
                this.setState({ music_data_fav: Def.music_data_fav });
            }
        }).done();
        */

    }

    endListReach(){
        console.log("endListReach");


        if(this.offset >= 0 && this.requesting == false){
            this.requesting = true;
            NetProgram.listFeaturePrograms(this.onFeatureSuccess,this.onFeatureFailed,this.amount,this.offset);
        }


    }

    onNewsSuccess(data){
        console.log("onNewsSuccess");

        Def.news_data = data["data"];
        this.setState({ news_data: Def.news_data });

        AsyncStorage.setItem('news_data', JSON.stringify(Def.news_data));
    }

    onNewsFailed(data){
        ////console.log(data);
    }

    refresh()
    {
        //NetChannel.listChannel(this.onChannelSuccess,this.onChannelFailed);
        this.setState({ stateCount: Math.random() });
    }

    onFeatureSuccess(data){
        console.log("onFeatureSuccess");
        ////console.log(data);

        if(Def.program_data == null)
            Def.program_data = data["data"]['featured'];
        else
            Def.program_data = Def.program_data.concat(data["data"]['featured']);

        this.offset =    this.amount + this.offset;

        if(data["data"]['total'] < this.offset){
            this.offset = -1;
        }

        this.setState({ program_data: Def.program_data });
        //AsyncStorage.setItem('program_data', JSON.stringify(Def.program_data));
        this.requesting = false;
    }

    onFeatureFailed(data){
        console.log("onFeatureFailed");

    }

    getAdsSize(){
        let widthh = Math.floor(width - 25);
        let heighth = 70;
        let rs = (widthh.toString()+ "x" + heighth.toString()).toString();
        return rs;

    }

    onChannelSuccess(data){
        console.log("onChannelSuccess");
        ////console.log(data);
        Def.channels_data_radio = data["data"]["Radio"];
        Def.channels_data_tv = data["data"]["TV"];
        this.setState({ channels_data_radio: Def.channels_data_radio });

        AsyncStorage.setItem('channels_data_radio', JSON.stringify(Def.channels_data_radio));
        AsyncStorage.setItem('channels_data_tv', JSON.stringify(Def.channels_data_tv));

        AsyncStorage.getItem("last_channel").then((last_channel) => {
            if (!last_channel){


                if(Object.entries(Def.channels_data_radio)[0][1].length > 0){
                    let last_channel = Object.entries(Def.channels_data_radio)[0][1][0];
                    let last_all_radio = Object.entries(Def.channels_data_radio)[0][1];
                    AsyncStorage.setItem('last_channel', JSON.stringify(last_channel));
                    AsyncStorage.setItem('last_all_radio', JSON.stringify(last_all_radio));

                    Def.setItemRadio(last_channel,last_all_radio,true);

                }
            }
        }).done();


    }

    onChannelFailed(data){
        ////console.log(data);
    }


    renderItem = ({item, index}) => {
        RenderCount[`Item${index}`] += 1;

          return (
            <View key={index} style={styles.cardStyle}>
              <Text>{item.name}</Text>
            </View>
          );
      }
    renderHeader = (props) => {
        return (<View>
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


            {
                this.state.channels_data_radio && Object.entries(this.state.channels_data_radio).map((prop, key) => {


                    prop[0] = (prop[0] == "" ? "Khác" : prop[0]);
                    return (

                    <View key={key} style={[styles.programListStyle, {marginTop: key == 0 ? 5 : 10}]}>
                            <ProgramHozList refresh={this.refresh} stack={'PlayRadio'}
                                            screen={'commonPlayRadio'} group={'Chanel'} favorite={true}
                                            navigation={this.props.navigation} name={prop[0]}
                                            style={styles.programListStyle} data={prop[1]} title={prop[0]}/>
                        </View>
                    );
                })
            }


            <View style={[styles.titleBtn, {paddingLeft : 15}]}>
                <TouchableOpacity style={styles.titleView}  >
                    <Text style={styles.titleStyle}>{"Chương trình đặc sắc"}</Text>
                    <IconArrow  style={styles.iconStyleHome}  />
                </TouchableOpacity>
            </View>

        </View>);
    };
    renderFooter = () => {
      return (
          <View></View>
      )
    };

    render() {
        const {navigation} = this.props;
        return (
            <View style={styles.container}>


                <View style={{marginTop : 0}} >
                    <ProgramVerList
                            navigation={this.props.navigation}
                            name='favoriteProgram'
                            header={this.renderHeader(this.props)}
                            footer={this.renderFooter}
                            data={this.state.program_data}
                            title={"Chương trình đặc sắc"}
                            headerHeight={headerHeight}
                            endListReach={this.endListReach}
                            stack={'PlayRadio'}
                            screen={'radioPlayBack'}

                    />


                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex : 1,
      // paddingLeft: 15,
      // justifyContent: 'flex-start',
      // marginVertical : 5,
      // marginBottom : 5,
        backgroundColor :'#fff',

    },
    slider: {
      justifyContent: 'center',
      paddingTop: 5,
      padding: 8,
      height: 80,
      borderRadius: 5,
      backgroundColor: "#e6e6e6",
      marginRight : 15
    },
    adsSlider: {
        justifyContent: 'center',
        paddingTop: 5,
        paddingRight: 5,
        paddingLeft: 5,

        height: 100,
        borderRadius: 5,
        backgroundColor: "#e6e6e6",
        marginRight : 15
    },
    programListStyle : {
        marginTop : 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        backgroundColor : '#fff',
        shadowRadius: 5,
         paddingLeft : 15,
        zIndex : 5,
    },

    ads: {
        // width : width,
        height : 70,
        // justifyContent: "center",
        alignItems: "center",
        marginRight : 5,
        // paddingHorizontal: 5,
        // paddingRight: 15,
        // marginLeft: -20,
        // backgroundColor: 'red'
     },

    titlebtn: {
        fontSize: 18,
        color: Style.DEFAUT_RED_COLOR,
        fontWeight: 'bold',
        marginRight : 10
    },
    titleView: {
        paddingVertical : 10,
        flexDirection : 'row',
        alignItems: 'center',
        marginTop : 5,
    }
    ,
    titleStyle: {
        fontSize: 18,
        color: Style.DEFAUT_RED_COLOR,
        fontWeight: 'bold',
        marginRight : 10
    },
    iconStyleHome: {
        width: 15, height: 15
    },

  });

export default RadioScreen;
