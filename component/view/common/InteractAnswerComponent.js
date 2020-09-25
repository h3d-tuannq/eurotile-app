import React from 'react'
import {View, TouchableOpacity, StyleSheet , Text, Dimensions } from 'react-native'

import NetDailyContent from '../../../Net/NetDailyContent'
import Style from "../../../Def/Style";

const {width, height} = Dimensions.get('window');



function OptionItem(props) {
    console.log("function OptionItem(props)");
    console.log(props);
    return <TouchableOpacity style={props.select ? styles.optionItemSelect :styles.optionItem} onPress={()=> {
        props.selectOption(props.id);
    }}>
        <Text style={styles.aswText}>
            {props.item}
        </Text>
    </TouchableOpacity>
}

class InteractAnswerComponent extends React.Component{
    state = {
        select_index: -1,
        interact: this.props.interact,
        content_id:this.props.id,
        answered:false
    };

    onContentSuccess(data){
        console.log("on class InteractAnswerComponent extends React.Component");

        if(data["data"].length > 0)
            this.setState({ interact: data["data"][data["data"].length-1]});
        console.log(data["data"]);
    }

    onContentFailed(data){
        console.log("onContentFailed");
        //console.log(data);
        //
    }
    onSendAnsSuccess(data){
        console.log("onSendAnsSuccess");
        //console.log(data);
    }

    onSendAnsFailed(data){
        //
    }
    selectOption(select_index){
        this.setState({ select_index: parseInt(select_index)});
    }

    onPressSend(){

        if(!this.state.answered)
            this.setState({answered:true},()=>{NetDailyContent.sendInteact(this.onSendAnsSuccess,this.onSendAnsFailed,this.state.content_id,this.state.select_index)});
    }

    constructor(props){
        super(props);
        console.log(props);
        this.onContentSuccess     = this.onContentSuccess.bind(this);
        this.onContentFailed     = this.onContentFailed.bind(this);

        this.onSendAnsSuccess     = this.onSendAnsSuccess.bind(this);
        this.onSendAnsFailed     = this.onSendAnsFailed.bind(this);

        this.selectOption     = this.selectOption.bind(this);
        this.onPressSend     = this.onPressSend.bind(this);



    }


    componentDidMount() {
        console.log("componentDidMount");
        // NetDailyContent.getInteact(this.onContentSuccess,this.onContentFailed,this.state.content_id);
    }
    render(){
        return (
            !this.state.interact ?
            <View></View>
            :
            <View style={styles.rating}>
                <View style={styles.titleGroup}>
                    <Text style={styles.titleText}>
                        Tương tác
                    </Text>
                </View>

                <View style={styles.questionView}>
                    <Text style={{color: '#b3b3b3', fontSize:Style.TITLE_SIZE}}>
                        {
                            this.state.interact && this.state.interact.title + ": " + this.state.interact.description
                        }
                    </Text>
                    {
                        this.state.interact &&
                        Object.entries(this.state.interact.channelInteractOptions).map((value, index ) => {
                            return <OptionItem
                                        item={value[1]["content"]}
                                        id={value[1]["id"]}
                                        key={value[1]["id"]}
                                        select={this.state.select_index == parseInt(value[1]["id"])}
                                        selectOption = {this.selectOption}
                                        />
                        })
                    }

                </View>
                <TouchableOpacity style={styles.sendBtn} onPress={this.onPressSend}>
                    <Text style={{color:'#fff', fontSize:Style.TITLE_SIZE, fontWeight: 'bold'}}> Gửi </Text>
                </TouchableOpacity>

            </View>)
    }
}

const styles = StyleSheet.create({
    rating: {
        paddingVertical:10,
        marginHorizontal: 10,
        paddingLeft : 5,
        height : 150,
    },
    options: {
        marginTop : 20,

    },

    titleGroup : {
        justifyContent : 'center'
    },

    optionItem: {

        height: 50,
        justifyContent : 'center',
        // alignItems: 'center',
        backgroundColor : '#f0f0f0',
        marginTop: 5,
        paddingLeft: 20,

    },
    optionItemSelect: {

        height: 50,
        justifyContent : 'center',
        // alignItems: 'center',
        backgroundColor : '#C0C0C0',
        marginTop: 5,
        paddingLeft: 20,

    },
    aswText: {
        fontSize :Style.MIDLE_SIZE,
        fontWeight:'bold',
        color:'#341c1a',
    },

    starIcon: {
        width: 35,
        height: 35,


    },
    titleText: {
        fontSize: Style.TITLE_SIZE,
        color: Style.DEFAUT_RED_COLOR,
        fontWeight: 'bold',
    }
    ,
    pointText: {
        fontSize : Style.TITLE_SIZE,
        color: '#b3b3b3',
        marginLeft : 20,
    },
    sendBtn : {
        height: 50,
        // marginHorizontal : 10,
        justifyContent : 'center',
        // alignItems: 'center',
        backgroundColor : Style.DEFAUT_RED_COLOR,
        marginTop: 5,
        alignItems : 'center',
    }


});

export default InteractAnswerComponent;
