import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, PermissionsAndroid, TextInput , Keyboard } from 'react-native'
import DownIconSvg from '../../../../assets/icon/icon-down-black.svg'
import AsyncStorage  from '@react-native-community/async-storage'
import admob, { MaxAdContentRating ,BannerAd, BannerAdSize, TestIds} from '@react-native-firebase/admob';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import NetFeedback from '../../../../Net/NetFeedback'
import Def from '../../../../Def/Def';
const {width, height} = Dimensions.get('window');
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Style from "../../../../Def/Style";


export default class  FeedBackModal extends React.Component{
    state = {
        title:"",
        content:"",
        phone:"",
        email:Def.email,
        keyboardOpen:true,
        recording:false,
        recordTime:0,
        recordSecs:0.0
    }

    constructor(props){

        super(props);
        this.onFbSuccess        = this.onFbSuccess.bind(this);
        this.onFbErr            = this.onFbErr.bind(this);
        this.feedbackSend       = this.feedbackSend.bind(this);

        this._keyboardDidHide = this._keyboardDidHide.bind(this);
        this._keyboardDidShow = this._keyboardDidShow.bind(this);

        this.onStartRecord = this.onStartRecord.bind(this);
        this.audioRecorderPlayer =  new AudioRecorderPlayer();
        this.audioRecorderPlayer.setSubscriptionDuration(0.1); // optional. Default is 0.1
        this.recordPath = null;

        AsyncStorage.getItem("feedback_phone_number").then((value) => {
            if (value){
                this.setState({phone:value});
            }
        }).done();

        AsyncStorage.getItem("feedback_email").then((value) => {
            if (value){
                this.setState({email:value});
            }
        }).done();

        AsyncStorage.getItem("feedback_title").then((value) => {
            if (value){
                this.setState({title:value});
            }
        }).done();


    }


    onStartRecord = async () => {

        if (Platform.OS === 'android') {
            try {
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                  title: 'Permissions for write access',
                  message: 'Give permission to your storage to write a file',
                  buttonPositive: 'ok',
                },
              );
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the storage');
              } else {
                console.log('permission denied');
                return;
              }
            } catch (err) {
              console.warn(err);
              return;
            }
          }
          if (Platform.OS === 'android') {
            try {
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                {
                  title: 'Permissions for write access',
                  message: 'Give permission to your storage to write a file',
                  buttonPositive: 'ok',
                },
              );
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the camera');
              } else {
                console.log('permission denied');
                return;
              }
            } catch (err) {
              console.warn(err);
              return;
            }
          }

        const result = await this.audioRecorderPlayer.startRecorder();

        this.recordPath = result;
        this.audioRecorderPlayer.addRecordBackListener((e) => {

        if(!this.state.content || this.state.content.trim() =="")
            this.setState({content:"Voice"});

            this.setState({
                recordSecs: e.current_position,
                recordTime: this.audioRecorderPlayer.mmssss(Math.floor(e.current_position) ),
                recording: true
            },()=>{if(this.state.recordSecs/1000 >= 60) this.onStopRecord();});
            return;
        });
        console.log(result);
    };

    onStopRecord = async () => {
        const result = await this.audioRecorderPlayer.stopRecorder();
        this.audioRecorderPlayer.removeRecordBackListener();
        this.setState({
            recording: false,
        });
        console.log(result);
        return result;
    };




    feedbackSend = async () =>{
        const result  =  await this.onStopRecord() ;

        if(!this.state.email.includes("@", 0) && !this.state.email.includes(".", 0)){
            alert("Email không đúng định dạng");
        } else if(this.state.title.trim().length == 0){
            alert("Bạn vui lòng nhập tên");
        } else if(this.state.content.trim().length == 0){
            alert("Bạn vui lòng nhập nội dung");
        }  else if(this.state.phone.trim().length == 0){
            alert("Bạn vui lòng nhập số điện thoại");
        } else{
            const {navigation} = this.props;

            NetFeedback.sendFeedBack(this.onFbSuccess,this.onFbErr,this.state.title,this.state.content,this.state.phone,this.state.email,this.recordPath);
            AsyncStorage.setItem('feedback_phone_number', this.state.phone.trim());
            AsyncStorage.setItem('feedback_email', this.state.email.trim());
            AsyncStorage.setItem('feedback_title', this.state.title.trim());
            alert("Ý kiến của bạn đã được ghi nhận. Cám ơn đóng góp của bạn.");

            this.recordPath = null;
            this.setState({content:"" });

        }
    }

    onFbSuccess(data){
        console.log("onFbSuccess");
        //console.log(data);
    }

    onFbErr(err){
        console.log("onFbErr");
        console.log(err);

    }


    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow () {
        console.log('Keyboard show');
        this.setState({keyboardOpen: false});
    }

    _keyboardDidHide () {
        console.log('Keyboard hide');
        this.setState({keyboardOpen: true});
    }

    render() {
        return (
            <View style={{flex:1}}>

            <KeyboardAwareScrollView
                // style={{ backgroundColor: '#4c69a5' }}
                resetScrollToCoords={{ x: 0, y: 0 }}
                // contentContainerStyle={styles.container}
                scrollEnabled={false}
            >
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
                            {this.props.title ? this.props.title :  'Phản hồi'}
                        </Text>
                    </View>
                </View>
                <View style={styles.body}>

                    <View style={styles.ads}>
                            <BannerAd
                                unitId={TestIds.BANNER}
                                size={BannerAdSize.FULL_BANNER}
                                requestOptions={{
                                    requestNonPersonalizedAdsOnly: true,
                                }}
                                onAdLoaded={() => {
                                    console.log('Advert loaded');
                                }}
                                onAdFailedToLoad={(error) => {
                                    console.error('Advert failed to load: ', error);
                                }}
                                />

                    </View>
                    <View style={styles.content}>
                        <Text style={{fontSize :Style.MIDLE_SIZE, color :'#b3b3b3'}}>
                            Hotline liên hệ: 0123456789
                        </Text>
                        <View style={{flexDirection: 'row', paddingRight : 5, marginTop : 5,height:0}}>
                            <Text style={{fontSize :Style.MIDLE_SIZE, color :'#b3b3b3'}}>Bạn có thể </Text>
                            <Text style={{fontSize :Style.MIDLE_SIZE, color :Style.DEFAUT_RED_COLOR}}>Đăng nhập </Text>
                            <Text style={{fontSize :Style.MIDLE_SIZE, color :'#b3b3b3'}}>để phản hồi nhanh hồi nhanh hơn!</Text>
                        </View>
                        <View style={styles.input}>
                            <TextInput
                                style={styles.feedBackInput}
                                value={this.state.title}
                                onChangeText={text => this.setState({title:text})}
                                placeholder='Họ tên *'
                                autoCapitalize = 'none'

                            />
                            <TextInput
                                value={this.state.phone}
                                onChangeText={text => this.setState({phone:text})}
                                style={styles.feedBackInput}
                                placeholder='Số điện thoại *'
                                autoCapitalize = 'none'

                            />
                            <TextInput
                                value={this.state.email}
                                onChangeText={text => this.setState({email:text})}
                                style={styles.feedBackInput}
                                placeholder='Email *'
                                autoCapitalize = 'none'

                            />

                            <TextInput
                                value={this.state.content}
                                onChangeText={text => this.setState({content:text})}
                                style={styles.feedBackContent}
                                placeholder='Phản hồi... *'
                                autoCapitalize = 'none'

                            />
                            <View style={styles.btnGroup}>

                            <TouchableOpacity style={styles.speakBtn} onPress={this.state.recording ? this.onStopRecord : this.onStartRecord}>
                                <Text style={{color: '#fff', fontSize : Style.TITLE_SIZE, fontWeight : 'bold' }}>
                                    {this.state.recording ? `Đang ghi âm ${parseInt(this.state.recordSecs/1000)} giây (tối đa 60 giây)` : (this.recordPath ? `Phản hồi đã ghi âm: ${parseInt(this.state.recordSecs/1000)} giây`:"Thêm phản hồi bằng giọng nói")}

                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.sendBtn} onPress={this.feedbackSend} >
                                <Text style={{color: '#fff', fontSize : Style.TITLE_SIZE, fontWeight : 'bold' }}>
                                    Gửi
                                </Text>
                            </TouchableOpacity>
                            </View>


                        </View>

                    </View>




                </View>


            </KeyboardAwareScrollView>


                {
                    /*this.props.hidePlayer || this.state.keyboardOpen ?

                    <View/>:
                    <View  style={{position:'absolute',left: 0, right: 0, bottom: 1, zIndex:10}}>
                        <RadioMiniPlayer item={program}/>
                    </View> */
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    body : {
        marginHorizontal : 10,
    },

    header: {
        height :Style.HEADER_HEIGHT,
        flexDirection:'row',
        paddingVertical: 10,
        width: width,

    },
    content : {

        marginTop :20,
    },
    input: {
        marginTop : 10,
    }
    ,
    title:{
        fontSize: Style.TITLE_SIZE,
        color: Style.DEFAUT_RED_COLOR,
        fontWeight: 'bold',
        marginLeft: -20,
    },

    titleGroup : {
        justifyContent : 'center'
    },
    ads : {
        justifyContent: 'center',
        height: 80,
        borderRadius: 5,
        backgroundColor: "#e6e6e6",
        marginVertical : 5,
    },
    feedBackInput : {
        color: 'black',
        fontSize : Style.MIDLE_SIZE,
        height: 45, paddingHorizontal : 5 , borderColor: 'gray', backgroundColor : '#f0f0f0', borderWidth: 1 ,  borderRadius : 8, marginVertical: 5,
    },
    feedBackContent: {
        color: 'black',
        height : 100,
        fontSize : Style.MIDLE_SIZE,
        textAlignVertical: 'top',
        marginVertical: 5,
        paddingHorizontal : 5 , borderColor: 'gray', backgroundColor : '#f0f0f0', borderWidth: 1 ,  borderRadius : 8
    },
    btnGroup : {
         marginTop : 10,
         justifyContent : 'center',
         alignItems : 'center'
    },
    sendBtn : {
        marginVertical : 5,
        height: 45,width : 0.2 * width, backgroundColor : Style.DEFAUT_RED_COLOR, borderRadius : 8, justifyContent:'center', alignItems: 'center'
    },
    speakBtn :{
        width : width - 20,
        marginVertical : 5,
        height: 45, backgroundColor : '#00a54b', borderRadius : 8, justifyContent:'center', alignItems: 'center'
    },
    container : {
        // backgroundColor : 'red',
        flex : 1
    }
});

