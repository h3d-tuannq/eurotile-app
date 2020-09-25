import {PureComponent} from "react";
import {View, Button, StyleSheet, Image, Dimensions, Text,TouchableOpacity,Alert} from "react-native";
import DefaultProgramImage from "../../../assets/icon/logo_vov_16_9.svg";
import FavoriteIcon from "../../../assets/icon/icon-unlike.svg";
import FavoriteIconSelect from "../../../assets/icon/icon-like.svg";
import React from "react";
import NetPrograms from "../../../Net/NetProgram";
import PlayIcon from "../../../assets/icon/icon-play-mini.svg";
import Def from '../../../Def/Def'
import Style from "../../../Def/Style";

const {width, height} = Dimensions.get('window');

class ProgramVerItemrenderer extends PureComponent{
    state = {
        stateCount: 0.0,

    };

    constructor(props) {
        super(props);

        this.favoriteClickHandle = this.favoriteClickHandle.bind(this);
        this.favSuccess = this.favSuccess.bind(this);
        this.favFailed = this.favFailed.bind(this);
        this.playClickHandle = this.playClickHandle.bind(this);
    }


    favSuccess(data){
        console.log(`favSuccess ${JSON.stringify(data)}`);
    }
    favFailed(data){
        console.log(`favFailed ${data}`);

    }

    playClickHandle(){

        const model = this.props.item;
        console.log('click');
        console.log(model);


        if(model.fullpath != null){
            Def.setItemProgram(model);
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
        console.log('click');
        //console.log(this.props.item);


        if(model.favorite != null){
            model.favorite = null;

            NetPrograms.deleteFavoritePrograms(this.favSuccess,this.favFailed,this.props.item.id);
            this.setState({ stateCount: Math.random() });

        }
        else{
            model.favorite = "ok";
            NetPrograms.addFavoritePrograms(this.favSuccess,this.favFailed,this.props.item.id);
            this.setState({ stateCount: Math.random() });
        }

    }

    render(){
        const model = this.props.item;

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
            <TouchableOpacity  onPress={
                () => {
                    this.props.click(model);
                }}>
            <View style={styles.item}>

                    <View style={styles.program} >
                        {this.props.item.imagePath ? <Image style={styles.itemImage} source={model.imagePath} uri={this.props.item.imagePath}/> :
                            <Image  style={styles.itemImage}  source={require('../../../assets/icon/logo_vov_16_9.png')}  />}
                    </View>
                    <View style={styles.info}>

                        <Text style={styles.titleInfo}>{model.program_name}</Text>

                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems : 'center'}}>
                            <View>
                                <Text style={styles.infoText}>{model.channel_name}</Text>
                                <Text style={styles.infoText} >{model.start_time.split(":")[0] + ":" +model.start_time.split(":")[1] } - {model.broadcast_date.split("-")[2] + "/" +model.broadcast_date.split("-")[1] + "/" +model.broadcast_date.split("-")[0] }</Text>
                            </View>
                            <View>

                            {// model.isFavorite ? <FavoriteIconSelect style={styles.favoriteIcon} />:<FavoriteIcon style={styles.favoriteIcon} />
                            }

                                { model.favorite ?
                                        <TouchableOpacity style={{width:30, height: 30}} onPress={this.favoriteClickHandle}>
                                            <FavoriteIconSelect style={styles.favoriteIcon} />
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity style={{width:30, height: 30}} onPress={this.favoriteClickHandle}>
                                            <FavoriteIcon style={styles.favoriteIcon} />
                                        </TouchableOpacity>
                                }

                            </View>
                        </View>
                    </View>

            </View>
                </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    item: {
        // height : 120,
        paddingRight:15,
        paddingVertical:5,
        flexDirection:'row',


    },
    program: {
        flex: 1.2,
        justifyContent:'center',
    }
    ,
    itemImage: {
        width : width / 3.5,
        height : width / 3.5 * 82 / 130,
        borderRadius : 5,
        // width:125
    },
    info: {
        marginLeft:10,
        flex: 2.5,
        justifyContent: 'space-between',
        paddingVertical: 3,
    },
    titleInfo : {
        fontWeight: 'bold',
        fontSize : Style.NORMAL_SIZE,
        paddingBottom : 8,
    },
    infoText : {
        fontSize : Style.SMALL_SIZE,
        color: '#b3b3b3'
    },
    favoriteIcon : {
        width : 25,
        height : 25,
    }




});

export default ProgramVerItemrenderer;


