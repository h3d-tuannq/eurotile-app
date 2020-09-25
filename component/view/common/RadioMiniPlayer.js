import React from 'react'
import {View, TouchableOpacity, StyleSheet, Text, Animated, Alert, Image, Easing, AppRegistry} from 'react-native'

import DefaultProgramImage from '../../../assets/icon/logo-vov.svg';
import BackgroundTimer from 'react-native-background-timer';
import FavoriteIcon from "../../../assets/icon/icon-unlike.svg";
import FavoriteIconSelect from "../../../assets/icon/icon-like.svg";
import PlayIcon from '../../../assets/icon/icon-play-mini.svg';
import PauseIcon from '../../../assets/icon/icon-pause-mini.svg';
import TextTicker from 'react-native-text-ticker'
import Def from '../../../Def/Def'
import analytics from '@react-native-firebase/analytics';

import MusicControl from 'react-native-music-control';

import NetMusic from '../../../Net/NetMusic'
import NetPrograms from '../../../Net/NetProgram'
import NetChannel from '../../../Net/NetChannel'
import AsyncStorage  from '@react-native-community/async-storage'

import Video from 'react-native-video';
import Style from "../../../Def/Style";

class RadioMiniPlayer extends React.Component{

    type = 1;

    /*
        TYPE = 1: kênh radio        name                            stream_path
        TYPE = 2: music             name                            content_fullpath
        TYPE = 3: program           program_name  channel_name      fullpath
        TYPE = 4: news              title                           reader_link             thumbnail
    */



   componentDidMount() {
       if(this.state.paused == false){
        this.spin();
       } else {
           this.stop();
       }

  }
   onChannelSuccess(data){
        if(Def.lastType != Def.TYPE_RADIO)
            return;

        console.log("on onChannelSuccess Success");

        if(data["data"].length == 0){
            this.setState({ schedule_data: null,current_index:0 });
            return;
        }

        crrTime = Def.getDateString(new Date(), "HH:mm:ss");
        let allDataArr = data["data"][Object.keys(data["data"])[0]];

        let isPlaying = 0;
        for(let i = 0; i <allDataArr.length ; i++ ){
            if (isPlaying > 0){
                isPlaying+=1;
                if(this.state.dateStringDDMMYYYY == this.state.todayString)
                    allDataArr[i]["isPlaying"] = isPlaying;
            }
            if(allDataArr[i]["start_time"] <=crrTime && allDataArr[i]["end_time"] >= crrTime){
                isPlaying = 1;
                if(this.state.dateStringDDMMYYYY == this.state.todayString)
                    allDataArr[i]["isPlaying"] = 1;
                //this.setState({current_program:allDataArr[i], current_index : i});
                this.setState({name:allDataArr[i]['name'].trim(), current_index : i,current_radio_program:allDataArr[i]});

                MusicControl.setNowPlaying({
                    title:  allDataArr[i]['name'].trim(),
                    artist: Def.lastNameSmallMini,
                    artwork: this.state.item.image_fullpath,
                    album: 'Thriller',
                    genre: 'Post-disco, Rhythm and Blues, Funk, Dance-pop',

                    description: '', // Android Only
                    color: 0xFFFFFF, // Android Only - Notification Color
                    colorized: true, // Android 8+ Only - Notification Color extracted from the artwork. Set to false to use the color property instead
                    date: '1983-01-02T00:00:00Z', // Release Date (RFC 3339) - Android Only
                    rating: 84, // Android Only (Boolean or Number depending on the type)
                    notificationIcon: 'my_custom_icon' // Android Only (String), Android Drawable resource name for a custom notification icon
                  });
                console.log();

            }
        }
        //console.log(allDataArr);
        this.setState({ schedule_data: allDataArr });
    }

    onChannelFailed(data){

    }


   requestsCalendar(){
        if(Def.lastType != Def.TYPE_RADIO)
            return;

        if(this.state.item && this.state.item.id)
            NetChannel.listBroadcast(this.onChannelSuccess,this.onChannelFailed,this.state.item.id,Def.getDateString(new Date(), "dd-MM-yyyy"),Def.getDateString(new Date(), "dd-MM-yyyy"));
    }

    favSuccess(data){
        console.log(`favSuccess ${JSON.stringify(data)}`);
        Def.refresh_channel_homepage();
    }
    favFailed(data){
        console.log(`favFailed ${data}`);

    }


    constructor(props) {
        super(props);
        console.log("class RadioMiniPlayer extends React.Component");


        this.favoriteClickHandle    = this.favoriteClickHandle.bind(this);
        this.favFailed              = this.favFailed.bind(this);
        this.favSuccess             = this.favSuccess.bind(this);
        this.setProgress             = this.setProgress.bind(this);

        this.setItemRadio           = this.setItemRadio.bind(this);
        this.setItemMusic           = this.setItemMusic.bind(this);
        this.setItemProgram         = this.setItemProgram.bind(this);
        this.setItemNews            = this.setItemNews.bind(this);
        this.setItemDailyContent         = this.setItemDailyContent.bind(this);
        this.onFullScreen        = this.onFullScreen.bind(this);
        Def.setItemRadio            = this.setItemRadio;
        Def.setItemMusic            = this.setItemMusic;
        Def.setItemProgram          = this.setItemProgram;
        Def.setItemDailyContent          = this.setItemDailyContent;
        Def.setItemNews             = this.setItemNews;
        Def.setProgress             = this.setProgress;

        this.onChannelSuccess     = this.onChannelSuccess.bind(this);
        this.onChannelFailed     = this.onChannelFailed.bind(this);

        this.onMusic = this.onMusic.bind(this);
        this.onMusicFail = this.onMusicFail.bind(this);

        this.stopPlay               = this.stopPlay.bind(this);
        this.startPlay              = this.startPlay.bind(this);

        Def.stopPlay                = this.stopPlay;
        Def.startPlay               = this.startPlay;
        this.onPrev                     = this.onPrev.bind(this);
        this.onNext                     = this.onNext.bind(this);
        //Def.onPrevRadio                     = this.onPrev;
        //Def.onNextRadio                     = this.onNext;

        this.ccuSuccess               = this.ccuSuccess.bind(this);
        this.ccuFailed                = this.ccuFailed.bind(this);

        if(Def.lastNameMini && Def.lastNameSmallMini){
            console.log(`${Def.lastNameMini} : ${Def.lastNameSmallMini}`);

            this.state = {
                item:Def.lastItem,
                all_radio:Def.lastItemArr,
                name:Def.lastNameMini,
                channel_name:"",
                stream_path:"",
                paused: false,
                index: 0,
                timer: null,
                url : "",
                can_favorite : true,
                progress:0,
                all_music:null,
                name_small:Def.lastNameSmallMini,
                schedule_data: null,
                current_radio_program: null,
                enable_control: false,
                timer: null
            }
            if(Def.lastType == Def.TYPE_MUSIC){
                Def.setItemMusic(Def.lastItem,Def.lastItemArr);
            }
            else if(Def.lastType == Def.TYPE_RADIO){
                Def.setItemRadio(Def.lastItem,Def.lastItemArr);
            }
            else if(Def.lastType == Def.TYPE_PROGRAM){
                Def.setItemProgram(Def.lastItem);
            }
            else if(Def.lastType == Def.TYPE_NEWS){
                Def.setItemNews(Def.lastItem);
            }
            else if(Def.lastType == Def.TYPE_DAILYCONTENT){
                Def.setItemDailyContent(Def.lastItem);
            }
        }else{
            this.state = {
                item:Def.lastItem,
                all_radio:Def.lastItemArr,
                name:"",
                channel_name:"",
                stream_path:"",
                paused: false,
                index: 0,
                timer: null,
                url : "",
                can_favorite : true,
                progress:0,
                all_music:null,
                name_small:"",
                schedule_data: null,
                current_radio_program: null,
                enable_control: false,
                timer: null
            }
        }

        // Start a timer that runs continuous after X milliseconds
        const intervalId = BackgroundTimer.setInterval(() => {
            // this will be executed every 200 ms
            // even when app is the the background
            console.log('tic');
            this.requestsCalendar();
        }, 30*1000);

        let timer = setInterval(this.tick, 10*60*1000);
        this.setState({timer});
        this.spinValue = new Animated.Value(0)


    }

    tick =() => {
        if(Def.lastType == Def.TYPE_RADIO)
            NetChannel.coundCCU(this.ccuSuccess,this.ccuFailed,this.state.item.id);
    }
    ccuSuccess(data){

    }
    ccuFailed(data){
    }

    setProgress(progress_){
        //console.log(`setProgress(${progress_})`);
        this.setState({progress:(progress_*100)});
    }

    favoriteClickHandle(){
        console.log(`favoriteClickHandle`);
        console.log(` ${JSON.stringify(this.state.item)} `);

        if(!Def.email ||Def.email == "")
            Alert.alert(
                "Đăng nhập",
                "Vui lòng đăng nhập để thêm được các chương trình/ bài hát ưa thích",
                [
                { text: "Đồng ý", onPress: () => {
                    return;
                } }
                ],
                { cancelable: false }
            );

        if(!Def.email ||Def.email == ""){
            return;
        }
        if(this.state.item.favorite){
            this.state.item.favorite = null;
            this.setState({item:this.state.item});
            if(Def.lastType == Def.TYPE_MUSIC)
                NetMusic.deleteFavoriteMusic(this.favSuccess,this.favFailed,this.state.item.id);
            else if(Def.lastType == Def.TYPE_RADIO && !this.state.current_radio_program)
                NetChannel.deleteFavorite(this.favSuccess,this.favFailed,this.state.item.id);
            else if(Def.lastType == Def.TYPE_RADIO && this.state.current_radio_program)
                NetPrograms.deleteFavoritePrograms(this.favSuccess,this.favFailed,this.state.current_radio_program.id);
            else if(Def.lastType == Def.TYPE_PROGRAM || Def.lastType == Def.TYPE_DAILYCONTENT)
                NetPrograms.deleteFavoritePrograms(this.favSuccess,this.favFailed,this.state.item.id);
        }
        else{
            this.state.item.favorite = "ok";
            this.setState({item:this.state.item});

            if(Def.lastType == Def.TYPE_MUSIC)
                NetMusic.addFavoriteMusic(this.favSuccess,this.favFailed,this.state.item.id);
            else if(Def.lastType == Def.TYPE_RADIO && !this.state.current_radio_program)
                NetChannel.addFavorite(this.favSuccess,this.favFailed,this.state.item.id);
            else if(Def.lastType == Def.TYPE_RADIO && this.state.current_radio_program)
                NetPrograms.addFavoritePrograms(this.favSuccess,this.favFailed,this.state.current_radio_program.id);
            else if(Def.lastType == Def.TYPE_PROGRAM || Def.lastType == Def.TYPE_DAILYCONTENT)
                NetPrograms.addFavoritePrograms(this.favSuccess,this.favFailed,this.state.item.id);
        }

        if(Def.refresh_channel_homepage)
            Def.refresh_channel_homepage();

    }

    onPrev(){
        console.log("onPrev()");
        console.log( Def.lastItemArr );
        console.log(Def.lastItem);

        for(let i = 1; i < Def.lastItemArr .length; i++ ){
            let currItem =  Def.lastItemArr[i];
            let prevItem = Def.lastItemArr[i-1];
            if(currItem.id == Def.lastItem.id){
                Def.setItemRadio(prevItem, Def.lastItemArr );
                break;
            }
        }

    }

    onNext(){
        console.log("onNext()");
        console.log( Def.lastItemArr );
        console.log(Def.lastItem);

        for(let i = 0; i < Def.lastItemArr .length-1; i++ ){
            let currItem =  Def.lastItemArr [i];
            let nextItem =  Def.lastItemArr [i+1];
            if(currItem.id == Def.lastItem.id){
                Def.setItemRadio(nextItem, Def.lastItemArr );
                break;
            }
        }



    }

    setItemRadio(item,all_radio,first=false){
        console.log(`${item}`);
        console.log(`${all_radio}`);
        //if(first && this.state.item != null)
        //    return;

        NetChannel.coundCCU(this.ccuSuccess,this.ccuFailed,item.id);
        MusicControl.enableControl('nextTrack', true);
        MusicControl.enableControl('previousTrack', true);
        MusicControl.enableControl('seek', false) // Android only
        Def.lastType = Def.TYPE_RADIO;
        Def.lastItem = item;
        Def.lastItemArr = all_radio;

        Def.lastNameMini = item.name;
        Def.lastNameSmallMini = item.name+ " " + item.description;

        MusicControl.setNowPlaying({
            title: Def.lastNameMini,
            artist: Def.lastNameSmallMini,
            artwork: item.image_fullpath,
            album: 'Thriller',
            genre: 'Post-disco, Rhythm and Blues, Funk, Dance-pop',

            description: '', // Android Only
            color: 0xFFFFFF, // Android Only - Notification Color
            colorized: true, // Android 8+ Only - Notification Color extracted from the artwork. Set to false to use the color property instead
            date: '1983-01-02T00:00:00Z', // Release Date (RFC 3339) - Android Only
            rating: 84, // Android Only (Boolean or Number depending on the type)
            notificationIcon: 'my_custom_icon' // Android Only (String), Android Drawable resource name for a custom notification icon
          });

        this.setState({item:item,
            name:Def.lastNameMini,
            stream_path:item.stream_path,
            name_small:Def.lastNameSmallMini,
            all_radio:all_radio,
            progress:0,
            enable_control:true
        },()=> this.requestsCalendar());



        AsyncStorage.setItem('last_channel', JSON.stringify(item));
        AsyncStorage.setItem('last_all_radio', JSON.stringify(all_radio));

        console.log(`setItemRadio: ${item.stream_path}`);
        console.log(`item: ${JSON.stringify(item)}`);
        Def.global_player_start(item.stream_path);




        this.setState({can_favorite:true});

        analytics().logEvent('radio', {
                    radio_id: item.id,
                    radio_stream_path: item.stream_path,
                    radio_name: item.name,
                    user_email:Def.email
                }
            );

    }
    onMusic(data){

        console.log("onMusic");
        Def.global_player_start(data);
    }

    onMusicFail(data) {
        console.log("onMusicFail(data)");
        //console.log(data);
    }

    setItemMusic(item,all_music,newPlay = false){

        if(Def.onSlideMusic)
          Def.onSlideMusic(0 , 100);
        MusicControl.enableControl('nextTrack', true);
        MusicControl.enableControl('previousTrack', true);
        MusicControl.enableControl('seek', true) // Android only
        console.log(`setItemMusic(item)`);
        console.log(item);
        Def.lastType = Def.TYPE_MUSIC;
        Def.lastItem = item;
        Def.lastItemArr = all_music;
        this.setState({
                item:item,
                progress:0,
                name:item.name,
                stream_path:item.content_fullpath,
                paused:false, //Def.global_player_is_stop
                can_favorite:true,
                name_small:item.category,
                all_music:all_music,
                enable_control:true

            },()=>{console.log(`STATE: ${this.state}`);}); 

        Def.lastNameMini = item.name;
        Def.lastNameSmallMini = item.category;

        MusicControl.setNowPlaying({
            title: Def.lastNameMini,
            artist: Def.lastNameSmallMini,
            artwork: item.image_fullpath,
            album: 'Thriller',
            genre: 'Post-disco, Rhythm and Blues, Funk, Dance-pop',
            //duration: parseInt(item.duration), // (Seconds)
            description: '', // Android Only
            color: 0xFFFFFF, // Android Only - Notification Color
            colorized: true, // Android 8+ Only - Notification Color extracted from the artwork. Set to false to use the color property instead
            date: '1983-01-02T00:00:00Z', // Release Date (RFC 3339) - Android Only
            rating: 84, // Android Only (Boolean or Number depending on the type)
            notificationIcon: 'my_custom_icon' // Android Only (String), Android Drawable resource name for a custom notification icon
          });

        Def.global_player_stop();
        NetMusic.redirectMusic(this.onMusic,this.onMusicFail,item.content_fullpath);

        analytics().logEvent('music', {
                    music_id: item.id,
                    music_stream_path: item.content_fullpath,
                    music_name: item.name,
                    user_email:Def.email
                }
            );
    }
    setItemProgram(item){
        MusicControl.enableControl('nextTrack', false);
        MusicControl.enableControl('previousTrack', false);
        MusicControl.enableControl('seek', false) // Android only
        console.log('setItemProgram(item)');
        //console.log(item);
        Def.lastType = Def.TYPE_PROGRAM;
        Def.lastItem = item;
        this.setState({item:item});
        this.setState({name:item.program_name});
        this.setState({stream_path:item.fullpath});
        this.setState({paused:Def.global_player_is_stop});
        this.setState({can_favorite:true});
        this.setState({name_small:item.channel_name});
        this.setState({progress:0});
        this.setState({enable_control:true});


        Def.lastNameMini = item.program_name;
        Def.lastNameSmallMini = item.channel_name;


        MusicControl.setNowPlaying({
            title: Def.lastNameMini,
            artist: Def.lastNameSmallMini,
            artwork: 'http://dinhnhohao.hopto.org/vov_logo.jpg',
            album: 'Thriller',
            genre: 'Post-disco, Rhythm and Blues, Funk, Dance-pop',

            description: '', // Android Only
            color: 0xFFFFFF, // Android Only - Notification Color
            colorized: true, // Android 8+ Only - Notification Color extracted from the artwork. Set to false to use the color property instead
            date: '1983-01-02T00:00:00Z', // Release Date (RFC 3339) - Android Only
            rating: 84, // Android Only (Boolean or Number depending on the type)
            notificationIcon: 'my_custom_icon' // Android Only (String), Android Drawable resource name for a custom notification icon
          });

        Def.global_player_start(item.fullpath);

        analytics().logEvent('program', {
                    program_id: item.id,
                    program_stream_path: item.fullpath,
                    program_name: item.program_name,
                    user_email:Def.email
                }
            );
    }

    setItemDailyContent(item){
        MusicControl.enableControl('nextTrack', false);
        MusicControl.enableControl('previousTrack', false);
        MusicControl.enableControl('seek', false) // Android only
        console.log('setItemDailyContent(item)');
        //console.log(item);
        Def.lastType = Def.TYPE_DAILYCONTENT;
        Def.lastItem = item;
        this.setState({item:item});
        this.setState({name:item.name});
        this.setState({stream_path:item.fullpath});
        Def.global_player_start(item.fullpath);
        this.setState({can_favorite:true});
        this.setState({paused:Def.global_player_is_stop});
        this.setState({name_small:item.name});
        this.setState({progress:0});
        this.setState({enable_control:true});
        Def.lastNameMini = item.name;
        Def.lastNameSmallMini = item.name;


        MusicControl.setNowPlaying({
            title: Def.lastNameMini,
            artist: Def.lastNameSmallMini,
            artwork: 'http://dinhnhohao.hopto.org/vov_logo.jpg',
            album: 'Thriller',
            genre: 'Post-disco, Rhythm and Blues, Funk, Dance-pop',

            description: '', // Android Only
            color: 0xFFFFFF, // Android Only - Notification Color
            colorized: true, // Android 8+ Only - Notification Color extracted from the artwork. Set to false to use the color property instead
            date: '1983-01-02T00:00:00Z', // Release Date (RFC 3339) - Android Only
            rating: 84, // Android Only (Boolean or Number depending on the type)
            notificationIcon: 'my_custom_icon' // Android Only (String), Android Drawable resource name for a custom notification icon
          });

        console.log(` ${this.state.name} `);
        console.log(` ${JSON.stringify(this.state.item)} `);

        analytics().logEvent('program', {
                    program_id: item.id,
                    program_stream_path: item.fullpath,
                    program_name: item.program_name,
                    user_email:Def.email
                }
            );
    }
    setItemNews(item){
        MusicControl.enableControl('nextTrack', false);
        MusicControl.enableControl('previousTrack', false);
        MusicControl.enableControl('seek', false) // Android only
        console.log('setItemNews(item)');
        //console.log(item);
        Def.lastType = Def.TYPE_NEWS;
        Def.lastItem = item;
        this.setState({item:item});
        this.setState({name:item.title});
        this.setState({stream_path:item.reader_link});
        this.setState({can_favorite:false});
        this.setState({name_small:item.category});
        this.setState({progress:0});
        this.setState({enable_control:true});

        Def.lastNameMini = item.title;
        Def.lastNameSmallMini = item.category;



        MusicControl.setNowPlaying({
            title: Def.lastNameMini,
            artist: Def.lastNameSmallMini,
            artwork: item.thumbnail,
            album: 'Thriller',
            genre: 'Post-disco, Rhythm and Blues, Funk, Dance-pop',

            description: '', // Android Only
            color: 0xFFFFFF, // Android Only - Notification Color
            colorized: true, // Android 8+ Only - Notification Color extracted from the artwork. Set to false to use the color property instead
            date: '1983-01-02T00:00:00Z', // Release Date (RFC 3339) - Android Only
            rating: 84, // Android Only (Boolean or Number depending on the type)
            notificationIcon: 'my_custom_icon' // Android Only (String), Android Drawable resource name for a custom notification icon
          });

        Def.global_player_start(item.reader_link);
        this.setState({paused:Def.global_player_is_stop});

        analytics().logEvent('news', {
                    news_id: item.id,
                    news_stream_path: item.reader_link,
                    news_name: item.title,
                    user_email:Def.email
                }
            );
    }


    stopPlay(own = false){
        console.log("stopPlay(own = false)");
        this.setState({ paused: true },()=>{
            if(own){
                Def.global_player_stop();
                if(Def.stopPlay_music)
                    Def.stopPlay_music(false)
                if(Def.stopPlay_radio)
                    Def.stopPlay_radio(false)
            }

        });
        this.stop();
    }

    startPlay(own= false){

        console.log("startPlay(own = false)");
        this.setState({ paused: false },()=>{
            if(own){
                if(Def.lastType == Def.TYPE_MUSIC)
                    Def.setItemMusic(this.state.item,this.state.all_music,true);
                else if(Def.lastType == Def.TYPE_RADIO)
                    Def.setItemRadio(this.state.item,this.state.all_radio);
                else if(Def.lastType == Def.TYPE_PROGRAM || Def.lastType == Def.TYPE_DAILYCONTENT)
                    Def.setItemProgram(this.state.item);
            }
        });
        this.spin();

    }

    onFullScreen(){
        console.log('onFullScreen');
        if(Def.lastType == Def.TYPE_MUSIC){
            Def.mainNavigate.navigate('PlayMusic', {screen:'playMusic',params: {item:this.state.item,data:this.state.all_music}});
        }else if(Def.lastType == Def.TYPE_RADIO){
            console.log(this.state.all_radio);
            console.log(this.state.item);
            Def.mainNavigate.navigate('PlayRadio', {screen:'commonPlayRadio',params: {item:this.state.item,data:this.state.all_radio}});

        }
        else if(Def.lastType == Def.TYPE_PROGRAM){}
        else if(Def.lastType == Def.TYPE_NEWS){

        }
        else if(Def.lastType == Def.TYPE_DAILYCONTENT){}
    }

    spin () {

        this.spinValue.setValue(0)
        Animated.timing(
            this.spinValue,
            {
                toValue: 1,
                duration: 4000,
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start((o) =>  {
           if(o.finished){
            this.spin()
           }
        })

    }

    stop() {
        this.spinValue.setValue(0);
        Animated.timing(
            this.spinValue,
            {
                toValue: 1,
                duration: 4000,
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).stop();
    }


    render(){
        //console.log(`this.state.paused ${this.state.paused}`);

        MusicControl.updatePlayback({
            state: Def.global_player_is_stop ? MusicControl.STATE_PAUSED : MusicControl.STATE_PLAYING // (STATE_ERROR, STATE_STOPPED, STATE_PLAYING, STATE_PAUSED, STATE_BUFFERING)
        });

        const spin = this.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })

        return (
            <TouchableOpacity onPress={()=>this.onFullScreen()}>

                <View style={styles.all_item}>

                    <View style={styles.progressBar}>
                        <Animated.View style={[StyleSheet.absoluteFill], {backgroundColor: "red", width: `${this.state.progress}%`}}/>
                    </View>

                    <View style={styles.item}>
                    <View style={styles.program} >
                        {this.state.item && this.state.item && this.state.item.image_fullpath ?
                            <Animated.Image  style={{transform: [{rotate: spin}],width: 46, height:46, borderRadius : 23, marginTop : 2, padding:2 , marginLeft : 5}}  source={{uri:this.state.item.image_fullpath}}  /> :

                            <Animated.Image  style={{transform: [{rotate: spin}], width: 46, height:46, borderRadius : 23, marginTop : 2, padding:2 , marginLeft : 5}}  source={require('../../../assets/icon/logo-vov.png')}  />}
                    </View>
                    <View style={styles.info}>
                            <View style={styles.programInfo}>
                                <TextTicker
                                    style={styles.titleInfo}
                                    // duration={1500}
                                    //loop
                                    bounce={false}
                                    repeatSpacer={100}
                                    marqueeDelay={1000}
                                    scrollSpeed={100}
                                >
                                    {this.state.name ? this.state.name : "Tên chương trình"}
                                </TextTicker>
                                <View style={{flexDirection : 'row', }}>
                                {<Text style={styles.infoText}>{this.state.name_small ? this.state.name_small : "Tên chương trình"}</Text>}
                                    {<Text style={[styles.infoText, {marginLeft: 10}]}></Text>}
                                </View>
                            </View>
                            <View style={styles.iconGroup}>
                                {
                                    this.state.can_favorite ?
                                        this.state.item && 'favorite' in this.state.item && this.state.item.favorite?
                                        <TouchableOpacity   onPress={ this.favoriteClickHandle} >
                                            <FavoriteIconSelect style={styles.favoriteIcon} />
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity   onPress={ this.favoriteClickHandle} >
                                            <FavoriteIcon style={styles.favoriteIcon} />
                                        </TouchableOpacity>
                                    :
                                        <View/>

                                }

                                <TouchableOpacity onPress={this.state.paused ?  this.startPlay.bind(this,true)  : this.stopPlay.bind(this,true)    }>
                                    {this.state.paused ? <PlayIcon style={styles.favoriteIcon}/>:<PauseIcon style={styles.favoriteIcon}/>}
                                </TouchableOpacity>


                            </View>
                    </View>
                    </View>

                </View>

            </TouchableOpacity>

        )
    }
}

const styles = StyleSheet.create({
    all_item:{
        paddingVertical:2,
        paddingHorizontal: 1,
        flexDirection:'column',
        backgroundColor: '#fff'
    },
    item: {
        // height : 120,
        paddingRight:15,
        flexDirection:'row',
        // backgroundColor: '#f0f0f0'


    },  progressBar: {
        height: 2,
        width: '100%',
        backgroundColor: '#e6e6e6',
        flexDirection:'row'
        //borderColor: '#000',
        //borderWidth: 2,
        //borderRadius: 5
      },absoluteFill : {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
    iconGroup : {
        flexDirection : 'row',
        flex: 1.2,
        alignItems: 'center',
        justifyContent : 'space-around',
    },
    programInfo : {
        flex: 4,
        marginRight : 10,
    },
    program: {
        width : 70,
        justifyContent : 'center',
        // flex: 0.65,
        // backgroundColor: "red",
    }
    ,
    itemImage: {
        // width : width / 3.5,

        height : 70
    },
    info: {
        marginLeft:10,
        flex: 2.5,
        justifyContent: 'space-between',
        flexDirection : 'row',
        alignItems: 'center',

    },
    titleInfo : {
        fontWeight: 'bold',
        fontSize : Style.MIDLE_SIZE,
        paddingVertical : 3,



    },titleInfoSmall: {
        fontWeight: 'bold',
        fontSize : Style.MIDLE_SIZE,
        paddingVertical : 5,



    },
    infoText : {
        paddingVertical : 0,
        fontSize : Style.NORMAL_SIZE,
        color: '#b3b3b3'
    },
    favoriteIcon : {
        width : 25,
        height : 25,
    }
});

export default RadioMiniPlayer;
