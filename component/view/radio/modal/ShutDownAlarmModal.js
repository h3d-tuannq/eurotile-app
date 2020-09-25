import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import DownIconSvg from '../../../../assets/icon/icon-down-black.svg'
import InputSpinner from "react-native-input-spinner";
import Def from '../../../../Def/Def'

import analytics from '@react-native-firebase/analytics';
import Style from "../../../../Def/Style";
const {width, height} = Dimensions.get('window');

class ShutDownAlarmModal extends React.Component{
    state = {
        hour:0,
        minute:0
    }

    constructor(props){
        super(props);
        this.setSchedule = this.setSchedule.bind(this);

    }
    setSchedule(){
        Def.global_player_schedule(this.state.hour*60*60 + this.state.minute*60);
        console.log(Def.global_player_schedule + "--" + Def.schedule)

        // this.setState({ stateCount: Math.random() });
    }

    render() {

        analytics().setCurrentScreen(Def.SCREEN_ALARM);
        return (
            <View style={{flex:1, backgroundColor:'#fff'}}>
                <View style={styles.header}>
                    <TouchableOpacity style={{justifyContent:'center',  paddingLeft: 10, width:50}}
                                      onPress={() => {
                                          this.props.navigation.goBack();
                                      }}
                    >
                        <DownIconSvg width={25} height={25} />
                    </TouchableOpacity>
                    <View style={{alignItems:'center', justifyContent: 'center', marginLeft: 30}}>
                        <Text style={styles.title}>
                            Hẹn giờ tắt
                        </Text>
                    </View>
                </View>
                <View style={styles.body}>
                    <View style={styles.optionsContainer}>
                        <Text style={styles.titleText}>
                            Tắt âm thanh sau
                        </Text>
                        <View style={styles.optionList}>
                            <TouchableOpacity style={styles.optionItem} onPress={()=>this.setState({hour:0,minute:15},()=>{this.setSchedule()})}>
                                <Text style={styles.normalText}>
                                    15 phút
                                </Text>
                            </TouchableOpacity>


                            <TouchableOpacity style={styles.optionItem} onPress={()=>this.setState({hour:0,minute:30},()=>{this.setSchedule()})}>
                                <Text style={styles.normalText}>
                                    30 phút
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.optionItem} onPress={()=>this.setState({hour:0,minute:45},()=>{this.setSchedule()})}>
                                <Text style={styles.normalText}>
                                    45 phút
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.optionItem} onPress={()=>this.setState({hour:1,minute:0},()=>{this.setSchedule()})}>
                                <Text style={styles.normalText}>
                                    1 tiếng
                                </Text>
                            </TouchableOpacity>

                        </View>


                        <View style={styles.customizeTime}>
                            <Text style={[styles.normalText, styles.customizeItem]}>
                                Tùy biến
                            </Text>
                            <View style={styles.customizeItem}>
                                <InputSpinner
                                    width={105}
                                    height={35}
                                    min={0}
                                    rounded={false}
                                    showBorder={true}
                                    colorMin={Style.DEFAUT_BLUE_COLOR}
                                    colorMax={Style.DEFAUT_BLUE_COLOR}
                                    max={24} onChange={(value) => this.setState({minute:parseInt(value)},()=>{this.setSchedule()})}
                                    value={this.state.hour}/>
                            </View>

                            <Text style={[styles.normalText,styles.customizeItem]}>
                                giờ
                            </Text>
                            <View style={styles.customizeItem}>
                                <InputSpinner
                                              width={105}
                                              height={35}
                                              min={0}
                                              rounded={false}
                                              showBorder={true}
                                              colorMin={Style.DEFAUT_BLUE_COLOR}
                                              colorMax={Style.DEFAUT_BLUE_COLOR}
                                              max={60} onChange={(value) => this.setState({minute:parseInt(value)},()=>{this.setSchedule()})}
                                              value={this.state.minute}/>
                            </View>
                            <Text style={[styles.normalText, styles.customizeItem]}>
                                phút
                            </Text>
                        </View>


                        {
                            Def.schedule == "" ?
                            <View></View>
                            :
                            <TouchableOpacity style={{marginTop : 20}}>
                                <Text style={{fontSize : Style.MIDLE_SIZE, color: 'blue'}}>
                                    Đã hẹn giờ tắt lúc: {Def.schedule}
                                </Text>

                            </TouchableOpacity>

                        }
                        <TouchableOpacity style={{marginTop : 20}} onPress={()=>{
                            this.setState({hour:0,minute:0},()=>{this.setSchedule()});
                        }}>
                            <Text style={{fontSize : Style.MIDLE_SIZE, color: Style.DEFAUT_RED_COLOR}}>
                                Tắt hẹn giờ
                            </Text>

                        </TouchableOpacity>

                    </View>

                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    body : {
        marginHorizontal : 10,
        paddingLeft: 10,
        // backgroundColor : 'red',
        justifyContent : 'flex-end',
        flex: 1,
        paddingBottom :30

    },

    header: {
        height :50,
        flexDirection:'row',
        paddingVertical: 10,
        width: width,

    },
    customizeTime: {
      flexDirection: 'row',
      // justifyContent : 'space-around',
      alignItems : 'center',
        marginTop : 15,
    },

    customizeItem : {
      marginRight : 8,
    },

    optionList : {
        marginTop : 10,
        marginBottom :10,
    },
    optionItem : {
        paddingVertical: 10,
    }
    ,
    title:{
        fontSize: Style.TITLE_SIZE,
        color: Style.DEFAUT_RED_COLOR,
        fontWeight: 'bold',
        marginLeft: -20,
    },

    titleText : {
        fontSize: Style.BIG_SIZE,
        fontWeight: 'bold',
    },
    normalText : {
        fontSize: Style.MIDLE_SIZE,
        color: '#b3b3b3',
    },
    note: {
        fontSize: Style.MIDLE_SIZE,
        color: '#b3b3b3',
        marginTop: 10,

    }
});

export default ShutDownAlarmModal;
