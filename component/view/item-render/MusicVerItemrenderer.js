import {PureComponent} from "react";
import {View, Button, StyleSheet, Image, Dimensions, Text, TouchableOpacity,Alert} from "react-native";
import DefaultProgramImage from "../../../assets/icon/logo-vov.png";
import FavoriteIcon from "../../../assets/icon/icon-unlike.svg";
import FavoriteIconSelect from "../../../assets/icon/icon-like.svg";
import React from "react";
import Def from '../../../Def/Def'
import NetMusic from '../../../Net/NetMusic'
import Style from "../../../Def/Style";

const {width, height} = Dimensions.get('window');

class MusicVerItemrenderer extends PureComponent{
    constructor(props) {
        super(props);

        this.favoriteClickHandle = this.favoriteClickHandle.bind(this);
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

    componentWillMount () {
        const model = this.props.item;
        model.singer_name = "";
        for(let i = 0; i <model.singers.length; i++ ){
            model.singer_name += (i>0 ? " - ":"");
            model.singer_name += model.singers[i]["name"];
        }
        this.setState({singer_name:model.singer_name});
    }
    render(){
        const model = this.props.item;
        const getPaddedComp = function(comp) {
            return ((parseInt(comp) < 10) ? ('0' + comp) : comp)
        }

        const formatName = function (text, maxCharacter = 12) {
            let rs = text;
            if(text.length > maxCharacter){
                rs = text.substring(0, maxCharacter) + " ...";
            }
            return rs;
        }

        return (
            <TouchableOpacity style={styles.item} onPress={() => {
                this.props.click(model);
            }}>
                <View  style={styles.songInfo}>
                    <View style={styles.program} >
                        {model.image_fullpath ? <Image style={styles.itemImage} source={{uri:model.image_fullpath}}/> :

                            <Image source={require('../../../assets/icon/logo-vov.png')}style={styles.itemImage}/>
                        }
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.titleInfo}>{model.name}</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View>
                                <Text style={styles.infoText}>{this.state.singer_name}</Text>
                                <Text style={styles.infoText} >{getPaddedComp(parseInt(model.duration/3600)) }:{getPaddedComp(parseInt(model.duration/60)) }:{getPaddedComp(model.duration%60) }</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.resInfo}>
                    <TouchableOpacity style={{alignItems : 'flex-end', width: 50, height : 30,paddingTop:10, paddingRight: 10}}  onPress={ this.favoriteClickHandle} >
                        {
                            model.favorite ? <FavoriteIconSelect style={styles.favoriteIcon} />:<FavoriteIcon style={styles.favoriteIcon} />
                        }
                    </TouchableOpacity>
                    <Text style={styles.infoText}>
                        Lượt nghe: {model.listens ? model.listens: 0 }
                    </Text>


                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    item: {
        // height : 120,
        paddingRight:15,
        paddingVertical:8,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    songInfo:{
      flexDirection:'row',
      width : width /1.8,

    },
    resInfo: {
      justifyContent:'space-around',
      width : width /4.5,
        alignItems: 'flex-end',

    }
    ,
    imageContainer:{
        // flex: 1,
        // backgroundColor: "red",
        borderRadius :5,
        justifyContent:'center'
    },
    itemImage: {
        width : width /4.5,
        height : width /5,
        borderRadius :5,
    },

    program: {
        // flex: 1,
        backgroundColor: "red",
        borderRadius :5,
        justifyContent:'center'
    }
    ,
    info: {
        marginLeft:20,
        flex: 1.2,
        justifyContent: 'space-around',
        paddingVertical: 5
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
        width : 20,
        height : 20,
    }
});

export default MusicVerItemrenderer;


