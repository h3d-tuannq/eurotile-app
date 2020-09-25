import React, {PureComponent} from 'react'
import {Linking, View, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Image,Text} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Carousel from 'react-native-snap-carousel';
import ProgramHozList from '../common/ProgramHozList'
import ProgramVerList from "../common/ProgramVerList";
import ProgramItemrenderer from "../item-render/ProgramItemrenderer"

import AsyncStorage  from '@react-native-community/async-storage'
import NetMusic from '../../../Net/NetMusic'
import NetSlide from '../../../Net/NetSlide';
import Def from '../../../Def/Def'
import Pagination from "react-native-snap-carousel/src/pagination/Pagination";
import NetDailyContent from '../../../Net/NetDailyContent';

const {width, height} = Dimensions.get('window');
const PROGRAM_IMAGE_WIDTH = (width - 60) /2.5
const PROGRAM_IMAGE_HEIGHT = (width - 60) /2.5

const FAKE_PERSON_OBJECT = {
    id: Math.floor(Math.random() * 10000),
    name: 'Komodo Brown'
};


const NUMBER_TO_RENDER = 5;



class MusicScreen extends React.Component {


    state = {
        music_data: Def.music_data,
        stateCount: 0.0,
        slide_data:[],
        activeSlide: 0
    };

    constructor(props){
        super(props);
        this.onMusicSuccess     = this.onMusicSuccess.bind(this);
        this.onMusicFailed     = this.onMusicFailed.bind(this);
        this.refresh     = this.refresh.bind(this);

        this.openLink = this.openLink.bind(this);

        this.onSlideSuccess         = this.onSlideSuccess.bind(this);
        this.onSlideFailed          = this.onSlideFailed.bind(this);

        Def.mainNavigate = this.props.navigation;


        NetMusic.listMusic(this.onMusicSuccess,this.onMusicFailed);
        NetSlide.getSlides(this.onSlideSuccess,this.onSlideFailed);

    }

    refresh()
    {
        //NetChannel.listChannel(this.onChannelSuccess,this.onChannelFailed);
        this.setState({ stateCount: Math.random() });
    }

    onMusicSuccess(data){
        console.log("onMusicSuccess");


        this.setState({ music_data: data["data"] });
        Def.music_data = data["data"] ;
        AsyncStorage.setItem('music_data', JSON.stringify(Def.music_data));


    }

    onMusicFailed(data){

    }

    onSlideSuccess(data){
        console.log("onSlideSuccess");
        ////console.log(data);
        this.setState({ slide_data: data["data"]["slides"]  });
    }

    onSlideFailed(data){

    }

    get pagination () {
        const { slide_data, activeSlide } = this.state;
        return (
            <Pagination
                dotsLength={slide_data.length}
                activeDotIndex={activeSlide}
                containerStyle={{ position:'absolute',top : 0, right : 10, width : slide_data.length  * 5,  paddingVertical: 5  }}
                dotContainerStyle={{marginHorizontal : 6,}}
                dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    borderWidth : 1,
                    backgroundColor : 'rgba(179, 179, 179, 0.92)',
                }}
                inactiveDotStyle={{

                    backgroundColor: 'rgba(255, 255, 255, 0.92)'
                }}
                inactiveDotOpacity={0.5}
                inactiveDotScale={1}
            />
        );
    }



    openLink(link){
       //alert(link);
       if(link.startsWith("http")){
            Linking.openURL(link).catch(err => console.error("Couldn't load page", err));
        } else if(link.startsWith("vov://channel")){
            id = link.replace("vov://channel/",'');
            //alert(`channel ${id}`);


            if(Def.channels_data_radio)
                Object.entries(Def.channels_data_radio).map((prop, key) => {

                    for(let i = 0; i < prop[1].length; i++){
                        //console.log(`${prop[1][i]['id']} - ${id}`);
                        if(parseInt(prop[1][i]['id']) == parseInt(id)){
                            Def.setItemRadio(prop[1][i],prop[1]);
                            Def.mainNavigate.navigate('PlayRadio', {screen:'commonPlayRadio', params: { item: prop[1][i], data : prop[1] }});
                        }
                    }
                });


            //NetChannel.getChannelById(this.onChannelSuccess,this.onChannelErr,id);
            //
        }else if(link.startsWith("vov://program")){
            id = link.replace("vov://program/",'');

            //alert(`program ${id}`);
            NetDailyContent.getContent(onProgramSuccess,onProgramErr,id);
        }
    }
    renderItem = ({item, index}) => {

        return (
            <View key={index} >

                <TouchableOpacity style = {[{}, styles.cardStyle]} onPress={ this.openLink.bind(this,item.url)} >
                    <Image  style = {[styles.cardImg, {resizeMode : 'stretch'}]} source={{ uri: item.image_url}} />
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        const {navigation} = this.props;
        return (
            <View style={styles.container}>
                <ScrollView style={{marginTop : 5}} >
                <View  style={styles.slider} >
                    <Carousel
                        ref={(c) => { this._carousel = c; }}
                        data={this.state.slide_data}
                        renderItem={this.renderItem}
                        itemWidth={width -20}
                        itemHeight={200}
                        sliderWidth={width -20}
                        inactiveSlideOpacity={1}
                        inactiveSlideScale={1}
                        loop={true}
                        autoplay={true}
                        autoplayDelay={5000}
                        activeSlideAlignment={'start'}
                        onSnapToItem={(index) => this.setState({ activeSlide: index }) }

                    />
                    {this.pagination}
                </View>

                    <View>

                    {
                        this.state.music_data && Object.entries(this.state.music_data).map((prop, key) => {

                            return (
                                <View key={key} style={[styles.programListStyle, {marginTop : key == 0 ? 5 : 10}]}>
                                 <ProgramHozList    key={prop[0]}
                                                    stack={'PlayMusic'}
                                                    screen={'playMusic'}
                                                    refresh={this.refresh}
                                                    group={'MusicChanel'}
                                                    favorite={true}
                                                    navigation={this.props.navigation}
                                                    name={prop[0]}
                                                    style={styles.programListStyle}
                                                    data={prop[1].slice().reverse()}
                                                    title={prop[0]}
                                                    programType={'music'}
                                 />
                                </View>
                            );
                        })
                    }



                    {/*<View  style={styles.ads} >*/}
                        {/*<View style={styles.adsSlider}>*/}

                        {/*</View>*/}
                        {/*<FlatList*/}
                            {/*style={{marginTop: 8}}*/}
                            {/*horizontal={true}*/}
                            {/*data={adsChanel}*/}
                            {/*renderItem={renderItem}*/}
                            {/*keyExtractor={item => item.id}*/}
                            {/*showsHorizontalScrollIndicator={false}*/}
                        {/*/>*/}
                    {/*</View>*/}
                    {/*<ProgramVerList navigation={this.props.navigation} name='favoriteProgram' data={programData} title={"Chương trình đặc sắc"}/>*/}
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex : 1,
        // marginVertical : 5,
        // marginBottom : 5,
        backgroundColor :'#fff'
    },
    slider: {
        // paddingTop: 10,
        // padding: 8,
        height: width / 2,
        borderRadius: 5,
        // backgroundColor: "#e6e6e6",
        // marginRight : 15,
        marginTop: 10,
        justifyContent:'center',
        alignItems: 'center',
    },
    cardStyle: {
        justifyContent: 'center',
        alignItems: 'center',

    },
    cardImg: {
        width: width-30,
        height: width/2,
        borderRadius : 10,
    },
    adsSlider: {
        justifyContent: 'center',
        paddingTop: 5,
        padding: 8,
        height: 100,
        borderRadius: 5,
        // backgroundColor: "#e6e6e6",
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
        marginTop: 20,


    },
  });

export default MusicScreen;
