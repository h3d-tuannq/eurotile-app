import React from 'react'
import {View, Text, StyleSheet, Dimensions, TouchableOpacity,Alert} from  'react-native'

const {width, height} = Dimensions.get('window');

import FavoriteIcon from "../../../assets/icon/icon-unlike.svg";
import FavoriteIconSelect from "../../../assets/icon/icon-like.svg";
import PlayIcon from "../../../assets/icon/icon-play-mini.svg";
import NetPrograms from '../../../Net/NetProgram'
import Def from '../../../Def/Def';
import Style from "../../../Def/Style";


class PlaybackItemrenderer extends React.PureComponent{
    constructor(props){
        super(props);
        this.favoriteClickHandle = this.favoriteClickHandle.bind(this);
        this.playClickHandle = this.playClickHandle.bind(this);
        this.favSuccess = this.favSuccess.bind(this);
        this.favFailed = this.favFailed.bind(this);
    }
    state = {
        stateCount: 0.0,

    };

    favSuccess(data){
        console.log(`favSuccess ${JSON.stringify(data)}`);
        Def.refresh_channel_homepage();
    }
    favFailed(data){
        console.log(`favFailed ${data}`);

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

    playClickHandle(){

        const model = this.props.item;
        console.log('click');
        //console.log(model);


        if(model.fullpath != null){
            model.program_name = model.name;
            Def.setItemProgram(model);
            Def.mainNavigate.navigate('PlayRadio', {screen:'radioPlayBack', params: { item: model, data : this.props.data }});
        }

    }
    formatDisplayTime(time){
        var arr= time.split(':');
        return arr[0] + ':' + arr[1];
    }

    render(){
        const {item} =  this.props;

        const color = (item.isPlaying == 1) ? {color:Style.DEFAUT_RED_COLOR} : item.isPlaying == 2?  {color:'#b3b3b3'} : {color:'#000'} ;
        return (
            <View style={styles.item}>
                <View style={styles.programInfo}>
                    <View style={styles.program}>
                        <Text style={[styles.time,color]}>
                            {this.formatDisplayTime(item.start_time.trim())}
                        </Text>

                        <Text style={[{fontSize: Style.MIDLE_SIZE, flex:1},color]}>
                            {item.name.trim()}
                        </Text>
                    </View>
                    { !item.isPlaying ?
                        <View style={styles.btnControl}>
                            <View style={styles.rating}>
                                <Text style={{fontSize: Style.MIDLE_SIZE, color:'#b3b3b3'}}>
                                    {/*item.rating*/}
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.btn}  onPress={this.favoriteClickHandle}>
                                {item.favorite ? <FavoriteIconSelect style={styles.iconStyle}/> : <FavoriteIcon style={styles.iconStyle}/>}
                            </TouchableOpacity>

                            {
                                item.fullpath ?
                                <TouchableOpacity style={styles.btn}  onPress={this.playClickHandle}>
                                    <PlayIcon style={styles.iconStyle}/>
                                </TouchableOpacity>
                                :
                                null


                            }
                        </View> : <View/>
                    }
                </View>
                {
                    item.isPlaying == 1 ? <View style={styles.underline}></View> : <View/>
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    item: {
        // backgroundColor : '#f0f0f0',
        height: 40,
        marginVertical :1,
        marginHorizontal:10,
        paddingRight : 5,


    },
    programInfo: {
        height: 35,
        flexDirection : 'row',
        justifyContent : 'space-between',

        // backgroundColor : 'red',
        // alignItems : 'center'

    },
    time : {
        width : 50,
        fontSize : Style.MIDLE_SIZE,
    },
    btnControl: {
        flexDirection: 'row',
        alignItems : 'center',
        flex: 0.5,
        justifyContent : 'flex-end',
        // backgroundColor : 'red'
    },
    btn: {
        paddingLeft: 10,
    }
    ,
    program : {
        flex:1.5,
        flexDirection : 'row',
        alignItems: 'center',
        // backgroundColor : 'green',
        // paddingRight: 5,
        // justifyContent: 'space-between',

    },



    underline : {
        borderBottomColor: Style.DEFAUT_RED_COLOR,
        borderBottomWidth: 2,
        height :1,
        // paddingBottom:5
    },
    iconStyle: {
        width : 20,
        height : 20,
    }


});

export default PlaybackItemrenderer;
