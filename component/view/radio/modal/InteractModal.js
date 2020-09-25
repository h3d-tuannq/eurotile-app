import React from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView,
    KeyboardAvoidingView,
    Platform, Keyboard
} from 'react-native'
import DownIconSvg from '../../../../assets/icon/icon-down-black.svg'
import TextTicker from 'react-native-text-ticker'

import { KeyboardAwareScrollView, KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'

import RatingComponent from '../../common/RatingComponent'
import InteractAnswerComponent from '../../common/InteractAnswerComponent'
import CommentComponent from '../../common/CommentComponent'
import Style from "../../../../Def/Style";
import NetDailyContent from "../../../../Net/NetDailyContent";


const {width, height} = Dimensions.get('window');

const headerHeight = width / 2;

class InteractModal extends React.Component{
    state= {
        keyboardOpen: 0,
        commentListHeight : height -155,
        interact: null,
    }

    constructor(props){
        super(props);
        console.log("class InteractModal extends React.Component+++++++++++++++++++++++");
        console.log(this.props.route.params.id);

        this._keyboardDidHide = this._keyboardDidHide.bind(this);
        this._keyboardDidShow = this._keyboardDidShow.bind(this);


    }

    componentDidMount(){
        NetDailyContent.getInteact(this.onContentSuccess,this.onContentFailed,this.props.route.params.id);
    }

    onContentSuccess(data) {
        if (data["data"].length > 0) {
            this.setState({interact: data["data"][data["data"].length - 1]});
            this.setState({commentListHeight: height -105 -57 -150});
            console.log(data["data"]);

        }
    }
    onContentFailed(data){
        console.log("onContentFailed");
    }
    onSendAnsSuccess(data){
        console.log("onSendAnsSuccess");
    }

    onSendAnsFailed(data){
    }
    selectOption(select_index){
        this.setState({ select_index: parseInt(select_index)});
    }


    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow (e) {
        this.setState({keyboardOpen: 1});
    }

    _keyboardDidHide () {
        this.setState({keyboardOpen: 0});
    }



    render() {
        return (
                <View style={styles.inner} >

                        <View style={styles.header}>
                            <TouchableOpacity style={{justifyContent: 'center', paddingLeft: 10, width: 50}}
                                              onPress={() => {
                                                  this.props.navigation.goBack();
                                              }}
                            >
                                <DownIconSvg width={25} height={25}/>
                            </TouchableOpacity>

                            <View style={{alignItems: 'center', justifyContent: 'center', marginLeft: 30}}>
                                <Text style={styles.title}>
                                    Tương tác / Bình luận
                                </Text>
                            </View>


                        </View>
                    {this.state.keyboardOpen ? <View/> :
                    <View style={{}}>
                      <RatingComponent  id={this.props.route.params.program_id}/>
                      <InteractAnswerComponent id={this.props.route.params.id} interact={this.state.interact}/>
                    </View>
                    }
                    <View style={{ marginTop : 20, flex:1}} >
                        <CommentComponent id={this.props.route.params.id} listHeight={this.state.commentListHeight} dependKeyboard={false} openHeight={height*0.45}  />
                    </View>
                </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        height :Style.HEADER_HEIGHT,
        flexDirection:'row',
        paddingVertical: 10,
        width: width,
        // flex:1,

    },
    title:{
        fontSize: 18,
        color: Style.DEFAUT_RED_COLOR,
        fontWeight: 'bold',
        marginLeft: -20,
    },

    titleGroup : {
        justifyContent : 'center'
    },
    inner: {
        flex: 1,
        backgroundColor : '#fff'

        // justifyContent: "space-around"
    }




});

export default InteractModal;
