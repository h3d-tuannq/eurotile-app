import {PureComponent} from "react";
import {Image, StyleSheet, TouchableOpacity, Text, View,Alert} from "react-native";

import DefaultProgramImage from "../../../assets/icon/logo-vov.svg";
import React from "react";
import FavoriteIcon from "../../../assets/icon/icon-unlike.svg";
import FavoriteIconSelect from "../../../assets/icon/icon-like.svg";
import NetChannel from '../../../Net/NetChannel'
import Def from "../../../Def/Def";
import NetMusic from "../../../Net/NetMusic";
import Style from '../../../Def/Style'
class ProgramItemrenderer extends PureComponent{
    state = {
        stateCount: 0.0,

    };

    callbackIndex = 0;

    constructor(props) {
        super(props);
        this.favoriteClickHandle = this.favoriteClickHandle.bind(this);
        this._calbackFavChannel = this._calbackFavChannel.bind(this);

        this.favSuccess = this.favSuccess.bind(this);
        this.favFailed = this.favFailed.bind(this);

        this.favoriteClickHandle = this.favoriteClickHandle.bind(this);
        this._calbackFavChannel = this._calbackFavChannel.bind(this);

        Def.love_radio_channel_arr_callback.push(this._calbackFavChannel);
        this.callbackIndex = Def.love_radio_channel_arr_callback.length-1;
    }

    favSuccess(data){
        console.log(`favSuccess ${JSON.stringify(data)}`);
        if(false && this.props.refresh)
            this.props.refresh();
    }
    favFailed(){
        console.log(`favFailed ${data}`);

    }


    _calbackFavChannel(_id_int){
        console.log("_calbackFavChannel");
        const model = this.props.item;
        if(parseInt(model.id) == _id_int && this.props.group != "MusicChanel"){
            if(model.favorite != null ){
                model.favorite = null;
                this.setState({ stateCount: Math.random() });
            }
            else{
                model.favorite = "ok";
                this.setState({ stateCount: Math.random() });
            }
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
        const group = this.props.group;

        console.log('click');


        if(model.favorite != null){
            model.favorite = null;

            if(group == "MusicChanel")
                NetMusic.deleteFavoriteMusic(this.favSuccess,this.favFailed,this.props.item.id);
            else
                NetChannel.deleteFavorite(this.favSuccess,this.favFailed,this.props.item.id);

            this.setState({ stateCount: Math.random() });

        }
        else{
            model.favorite = "ok";
            if(group == "MusicChanel")
                NetMusic.addFavoriteMusic(this.favSuccess,this.favFailed,this.props.item.id);
            else
                NetChannel.addFavorite(this.favSuccess,this.favFailed,this.props.item.id);
            this.setState({ stateCount: Math.random() });
        }

        // gọi tới hàm để unfav/fav các kênh khác ngoại trừ kênh vừa fav, un fav
        //console.log(Def.love_radio_channel_arr_callback.length );
        for(let i = 0; i < Def.love_radio_channel_arr_callback.length; i++){
            if(i != this.callbackIndex)
                Def.love_radio_channel_arr_callback[i](parseInt(this.props.item.id));
        }



        if(false && this.props.refresh)
            this.props.refresh();
    }

    formatText(text, maxCharacter = 20){
        let rs = text;
        if(text.length > maxCharacter -2){
            rs = text.substring(0, maxCharacter -2) + " ...";
        }
        return rs;
    }


    render(){
        const model = this.props.item;
        const click = this.props.click;
        //console.log(model);
        const FavoriteItem = ()=> {
            if(this.props.favorite ){

                if(model.favorite!=null){
                    return (
                        <FavoriteIconSelect style={styles.favoriteIcon}
                        />)
                } else {
                    return ( <FavoriteIcon style={styles.favoriteIcon}/> )
                }

            }
            return null;
        };

        return (
            <View>

            <TouchableOpacity style={[styles.itemStyle, this.props.styleImage]} onPress={
                () => {
                    click(model);
                }
            } >
                {this.props.favorite ?
                    <TouchableOpacity style={styles.favoriteIcon} onPress={this.favoriteClickHandle}>
                        <FavoriteItem />
                    </TouchableOpacity>
                    :
                    null
                }


                {model.image_fullpath ?
                    <Image  style={[this.props.styleImage, styles.imageStyle ]}  source={{uri:model.image_fullpath}}  />
                    :
                    <DefaultProgramImage style={styles.imageStyle} width={this.props.styleImage.width} height={this.props.styleImage.height}/>
                }

                </TouchableOpacity>
                {
                     this.props.type == 'music' ? <Text style={{marginTop:5, zIndex: 10, fontSize : Style.SMALL_SIZE, color : '#b3b3b3', width:this.props.styleImage.width}}>{this.formatText(model.name, 15)}</Text> : null
                }
            </View>

        )
    }
}

const  styles = StyleSheet.create({
    itemStyle : {
            borderRadius: 5,
            marginRight: 5,
            alignItems : 'flex-start',
            marginTop: 5,

    },
    imageStyle : {

        borderRadius: 5,
    },

    favoriteIcon : {
        width:20,
        height:20,
        position: 'absolute',
        top:3,
        right: 3,
        zIndex : 10,
        padding : 5,
    }
});

export default ProgramItemrenderer;
