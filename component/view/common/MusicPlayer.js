import React from 'react'
import {View, TouchableOpacity, StyleSheet,Alert } from 'react-native'

import FavoriteIcon from "../../../assets/icon/icon-unlike.svg";
import FavoriteIconSelect from "../../../assets/icon/icon-like.svg";

import PreviousIcon from '../../../assets/icon/icon-previous.svg';
import PlayIcon from '../../../assets/icon/icon-play-big.svg';
import PauseIcon from '../../../assets/icon/icon-pause-big.svg';

import analytics from '@react-native-firebase/analytics';
import NextIcon from '../../../assets/icon/icon-next.svg';
import ShareIcon from '../../../assets/icon/icon-share.svg';
import Def from '../../../Def/Def'
import NetMusic from '../../../Net/NetMusic'
import MusicControl from 'react-native-music-control';

class MusicPlayer extends React.Component{


    state = {
        paused: false,
        disableNextPrev : !(this.props.data && this.props.data.length > 0),
    }

    constructor(props){
        super(props);
        console.log("MusicPlayerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
        //console.log(this.props.item);


        this.favSuccess = this.favSuccess.bind(this);
        this.favFailed = this.favFailed.bind(this);
        this.favoriteClickHandle = this.favoriteClickHandle.bind(this);


        this.stopPlay               = this.stopPlay.bind(this);
        this.startPlay              = this.startPlay.bind(this);
        Def.stopPlay_music                = this.stopPlay;
        Def.startPlay_music               = this.startPlay;
        if(this.props.type == 'radio'){
            Def.setItemProgram(this.props.item);
        } else {
            Def.setItemMusic(this.props.item,this.props.data);
        }

    }


    favoriteClickHandle(){

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

        const model = this.props.item;

        if(model.favorite){
            model.favorite = null;
            NetMusic.deleteFavoriteMusic(this.favSuccess,this.favFailed,model.id);

        }
        else{
            model.favorite = "ok";
            NetMusic.addFavoriteMusic(this.favSuccess,this.favFailed,model.id);
        }

        this.setState({ stateCount: Math.random() });

    }

    stopPlay(own=false){
        if(Def.stopPlay)
            Def.stopPlay(false)

        this.setState({
            paused: true
        }, () => {
            console.log("stopPlay_music(own = false)");
            //if(own)
            Def.global_player_stop();
        });
    }

    startPlay(own=false){

        //if(Def.startPlay)
        //   Def.startPlay(false)

        this.setState({
            paused: false
        }, () => {
            console.log("startPlay_music(own = false)");
            if(this.props.type == 'radio'){
                Def.setItemProgram(this.props.item);
            } else {
                Def.setItemMusic(this.props.item,this.props.data);
            }
            //if(own)
            //    Def.global_player_start(null,true);
        });

    }

    favSuccess(data){
        console.log(`favSuccess ${JSON.stringify(data)}`);
    }
    favFailed(){
        console.log(`favFailed ${data}`);

    }



    render(){
        //analytics().setCurrentScreen('VOV_TV');

        // set up OS music controls
        // Basic Controls

        // set up OS music controls
        /*
        MusicControl.enableControl('seekForward', false);
        MusicControl.enableControl('seekBackward', false);
        MusicControl.enableControl('skipForward', false);
        MusicControl.enableControl('skipBackward', false);
        MusicControl.enableBackgroundMode(true);
        */
       //console.log(this.state.paused);
        return (<View style={styles.player}>


            <TouchableOpacity  onPress={ this.favoriteClickHandle} >
                {
                    this.props.item.favorite ? <FavoriteIconSelect style={styles.responeBtn} /> : <FavoriteIcon style={styles.responeBtn} />
                }

            </TouchableOpacity>

            <TouchableOpacity onPress={this.props.back} disabled={this.state.disableNextPrev}>
                <PreviousIcon style={styles.controlBtn} />
            </TouchableOpacity>



            <TouchableOpacity onPress={this.state.paused ?  this.startPlay.bind(this,true) : this.stopPlay.bind(this,true)   } >
                {
                    this.state.paused  ? <PlayIcon style={styles.playBtn} />:<PauseIcon style={styles.playBtn} />
                }
            </TouchableOpacity>


            <TouchableOpacity onPress={this.props.next} disabled={this.state.disableNextPrev}>
                <NextIcon style={styles.controlBtn} />
            </TouchableOpacity>

            <TouchableOpacity  onPress={this.props.share}>
                <ShareIcon style={styles.responeBtn} />
            </TouchableOpacity>
        </View>)
    }
}

const styles = StyleSheet.create({
    player: {
        flexDirection : 'row',
        justifyContent : 'space-around',
        alignItems : 'center',
        minWidth : 60,
        paddingVertical:5,
    },
    responeBtn: {
        width: 23,
        height: 23
    },
    controlBtn: {
        width: 32,
        height: 32
    },
    playBtn:{
        width :50,
        height:50
    }

});

export default MusicPlayer;
