import React from 'react'
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    Linking,
    TouchableOpacity,
    Image, Alert
} from 'react-native'
import Carousel, {Pagination} from 'react-native-snap-carousel';
import ProgramHozList from '../common/ProgramHozList'
import ProgramVerList from '../common/ProgramVerList'
import IconArrow from "../../../assets/icon/icon_arrow.svg";
import NetChannel from '../../../Net/NetChannel'
import Def from '../../../Def/Def'
import NetMusic from '../../../Net/NetMusic';
import NetProgram from '../../../Net/NetProgram';
import NetSlide from '../../../Net/NetSlide';
import AsyncStorage  from '@react-native-community/async-storage'
import NetDailyContent from '../../../Net/NetDailyContent';
import Style from "../../../Def/Style";

const {width, height} = Dimensions.get('window');

const headerHeight = width / 2;


const FAKE_PERSON_OBJECT = {
    id: Math.floor(Math.random() * 10000),
    name: 'Komodo Brown'
};

function createPersion(){
    let id = Math.floor(Math.random() * 10000);
    return {
        id: id ,
        name: 'Komodo Brown' + "_" +  id
    }
}

const NUMBER_TO_RENDER = 5;

const testData = [...new Array(NUMBER_TO_RENDER)].map(e => createPersion())

const RenderCount = {};

class HomeScreen extends React.Component {




    state = {
        channels_data_fav: Def.channels_data_fav,
        music_data_fav: Def.music_data_fav,

        program_data: Def.program_data_fav,
        slide_data: [],
        stateCount: 0.0,
        first: true,
        activeSlide: 0
    };

    componentDidMount() {
        console.log("MMMMMMMM");
      }

    constructor(props){
        super(props);

        this.onFeatureSuccess         = this.onFeatureSuccess.bind(this);
        this.onFeatureFailed          = this.onFeatureFailed.bind(this);

        this.onSlideSuccess         = this.onSlideSuccess.bind(this);
        this.onSlideFailed          = this.onSlideFailed.bind(this);
        this.onChannelSuccess         = this.onChannelSuccess.bind(this);
        this.onChannelFailed          = this.onChannelFailed.bind(this);
        this.onMusicSuccess         = this.onMusicSuccess.bind(this);
        this.onMusicFailed          = this.onMusicFailed.bind(this);


        this.sectionClick = this.sectionClick.bind(this);
        this._refresh = this._refresh.bind(this);
        this.openLink = this.openLink.bind(this);
        this.signInBtnClick = this.signInBtnClick.bind(this);


        Def.refresh_channel_homepage = this._refresh;
        Def.mainNavigate = this.props.navigation;

        AsyncStorage.getItem("login_token").then((value) => {
            if (value){
              Def.login_token = value;
              NetChannel.listFavorite(this.onChannelSuccess,this.onChannelFailed);
              NetMusic.listFavoriteMusic(this.onMusicSuccess,this.onMusicFailed);
              NetProgram.listFavoritePrograms(this.onFeatureSuccess,this.onFeatureFailed);
            }
        });


        NetSlide.getSlides(this.onSlideSuccess,this.onSlideFailed);

    }


    _refresh(){
        NetChannel.listFavorite(this.onChannelSuccess,this.onChannelFailed);
        NetMusic.listFavoriteMusic(this.onMusicSuccess,this.onMusicFailed);
        NetProgram.listFavoritePrograms(this.onFeatureSuccess,this.onFeatureFailed);
    }

    onFeatureSuccess(data){
        console.log("onFeatureSuccess");

        Def.program_data_fav = data["data"]["favorite"];

        for(let i = 0; i < Def.program_data_fav.length; i++){
            Def.program_data_fav[i]["favorite"] = "ok";
        }
        this.setState({ program_data: Def.program_data_fav });

        AsyncStorage.setItem('program_data_fav', JSON.stringify(Def.program_data_fav));
    }

    onFeatureFailed(data){
        console.log("onFeatureFailed");

    }

    onMusicSuccess(data){
        console.log("onMusicSuccess");
        console.log(data["data"]["favorite"]);
        this.setState({ musics_data: data["data"]["favorite"] });
        Def.music_data_fav = data["data"]["favorite"];

        //AsyncStorage.setItem('music_data_fav', JSON.stringify(Def.music_data_fav));
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

    onChannelSuccess(data){
        console.log("=================");
        console.log("onChannelSuccess");
        //console.log(data);


        Def.channels_data_fav = data["data"]["favorite"];
        console.log(Def.channels_data_fav);
        this.setState({ channels_data_fav: Def.channels_data_fav });
        console.log(Def.channels_data_fav);

        AsyncStorage.setItem('channels_data_fav', JSON.stringify(Def.channels_data_fav));



    }

    onChannelFailed(data){

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
                        console.log(`${prop[1][i]['id']} - ${id}`);
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
        RenderCount[`Item${index}`] += 1;
        //
        return (
            <View key={index} >

                <TouchableOpacity style = {[{}, styles.cardStyle]} onPress={ this.openLink.bind(this,item.url)} >
                    <Image  style = {[styles.cardImg, {resizeMode : 'stretch'}]} source={{ uri: item.image_url}} />
                </TouchableOpacity>
            </View>
        );
    }

    signInBtnClick(){
        Alert.alert(
            "Đăng nhập",
            "Vui lòng đăng nhập để sử dụng các tính năng cá nhân",
            [
                { text: "Đồng ý", onPress: () => {
                        Def.mainNavigate.navigate('Login', {screen: 'signIn'});
                    } },
                { text: "Bỏ qua", onPress: () => {
                        return;
                    } }
            ],
            { cancelable: false }
        );
    }

    sectionClick(screenGroup, name, title){
        this.props.navigation.navigate(screenGroup,{name: name});
        this.props.navigation.setOptions({ title:  title });
    }

    get pagination () {
        const { slide_data, activeSlide } = this.state;
        return (
            <Pagination
                dotsLength={slide_data.length}
                activeDotIndex={activeSlide}
                containerStyle={{ position:'absolute',top : 0, right : 10, width : slide_data.length  * 5,  paddingVertical: 5  }}
                dotContainerStyle={{marginHorizontal : 6}}
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
                inactiveDotOpacity={1}
                activeOpacity={1}
                inactiveDotScale={1}
            />
        );
    }




    renderHeader = (props) => {
        return (
        <View>
            <View  style={styles.slider} >
                <Carousel
                    ref={(c) => { this._carousel = c; }}
                    data={this.state.slide_data ? this.state.slide_data : []}
                    renderItem={this.renderItem}
                    itemWidth={width -20}
                    itemHeight={200}
                    sliderWidth={width -20}
                    inactiveSlideOpacity={1}
                    inactiveSlideScale={1}
                    activeSlideAlignment={'start'}
                    loop={true}
                    autoplay={true}
                    autoplayDelay={5000}
                    onSnapToItem={(index) => this.setState({ activeSlide: index }) }
                />
                { this.pagination }

            </View>
            <View>
                {this.state.channels_data_fav && <View  style={[styles.programListStyle, {marginTop:5}]}>{<ProgramHozList group={'Favorite'} stack={'PlayRadio'} screen={'commonPlayRadio'} clickHandle={this.sectionClick} navigation={props.navigation} name='Radio' data={this.state.channels_data_fav["Radio"]} title={"Radio yêu thích"} /> }</View>}
                {this.state.channels_data_fav && <View style={styles.programListStyle}>{<ProgramHozList group={'Favorite'} stack={'Tv'} screen={'play'}  clickHandle={this.sectionClick} navigation={props.navigation} style={styles.programListStyle} name='Tv' data={this.state.channels_data_fav["TV"]} title={"Kênh TV yêu thích"} />}</View>}
                <View style={styles.programListStyle}>{<ProgramHozList group={'Favorite'} clickHandle={this.sectionClick} stack={'PlayMusic'} screen={'playMusic'} navigation={props.navigation}  name='Bài hát' data={this.state.music_data_fav} title={"Bài hát yêu thích"} />}</View>

            <View style={[styles.titleBtn, {paddingLeft : 15}]}>
                <TouchableOpacity style={styles.titleView}  >
                    <Text style={styles.titleStyle}>{"Chương trình yêu thích"}</Text>
                    <IconArrow  style={styles.iconStyleHome}  />
                </TouchableOpacity>
            </View>
            </View>

        </View> );
      }
    renderFooter = () => {
        return <View/>
    }
    render() {

        return (
        (!Def.email ||Def.email == "") ?

         <View style={{justifyContent :'center',flex: 1, alignItems : 'center', width: width}}>
             <View style={{flexDirection: 'row'}}>
             <Text style={{fontSize:Style.TITLE_SIZE, color:'#b3b3b3'}}>
                 Vui lòng
             </Text>
             <TouchableOpacity onPress={this.signInBtnClick}>
                 <Text style={{fontSize:Style.TITLE_SIZE, marginLeft:5 , color:Style.DEFAUT_RED_COLOR}}>
                     đăng nhập
                 </Text>
             </TouchableOpacity>
             </View>
             <Text style={{fontSize:Style.TITLE_SIZE, color:'#b3b3b3'}}>
                 để sử dụng đầy đủ tính năng cá nhân
             </Text>

         </View> :


        <View style={styles.container}>

            <View style={{marginTop: 0}}>
                <ProgramVerList navigation={this.props.navigation} header={this.renderHeader(this.props)}
                                footer={this.renderFooter}
                                name='favoriteProgram' data={this.state.program_data} title={"Chương trình yêu thích"}
                                headerHeight={headerHeight}/>
            </View>
        </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex : 1,
        // paddingLeft: 15,
        // marginVertical : 5,
        // marginBottom : 5,
        backgroundColor : '#fff'
    },
    slider: {
        // paddingTop: 10,
        // padding: 8,
        height: width / 2,
        borderRadius: 5,
        // backgroundColor: "#e6e6e6",
        marginTop: 10,
        justifyContent:'center', alignItems: 'center',
        // paddingLeft :15,
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

    programListStyle : {
        marginTop : 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        backgroundColor : '#fff',
        shadowRadius: 5,
        paddingLeft : 15,
        zIndex : 5,
    },
    adsSlider: {
        justifyContent: 'center',
        paddingTop: 5,
        padding: 8,
        height: 100,
        borderRadius: 5,
        backgroundColor: "#e6e6e6",
        marginRight : 15
    },
    titlebtn: {
        fontSize: Style.TITLE_SIZE,
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
        fontSize: Style.TITLE_SIZE,
        color: Style.DEFAUT_RED_COLOR,
        fontWeight: 'bold',
        marginRight : 10
    },
    iconStyleHome: {
        width: 15, height: 15
    },
    programList: {

    }
});

export default HomeScreen;
