import React, {PureComponent} from 'react'
import {Text, View, Button, StyleSheet, Dimensions, SafeAreaView, Modal, TouchableOpacity} from 'react-native'
import FeedbackIcon from "../../../assets/icon/icon-feedback.svg";
import ListenerIcon from "../../../assets/icon/icon-listener.svg";
import PlaybackItemrenderer from "../item-render/PlaybackItemrenderer";
import NetChannel from '../../../Net/NetChannel'
import Def from '../../../Def/Def'
import analytics from '@react-native-firebase/analytics';
import Orientation from 'react-native-orientation-locker';
import VideoPlayer from 'react-native-video-controls';
import admob, { MaxAdContentRating ,BannerAd, BannerAdSize, TestIds} from '@react-native-firebase/admob';


import Video from 'react-native-video';
const {width, height} = Dimensions.get('window');
admob()
  .setRequestConfiguration({
    // Update all future requests suitable for parental guidance
    maxAdContentRating: MaxAdContentRating.PG,

    // Indicates that you want your content treated as child-directed for purposes of COPPA.
    tagForChildDirectedTreatment: true,

    // Indicates that you want the ad request to be handled in a
    // manner suitable for users under the age of consent.
    tagForUnderAgeOfConsent: true,
  })
  .then(() => {
    // Request config successfully set!
  });

const PROGRAM_IMAGE_WIDTH = (width - 30-8) /2
const PROGRAM_IMAGE_HEIGHT = (width - 30-8) /2

const renderItem = ({ item }) => (
    <PlaybackItemrenderer item={item} />
);

class TVModal extends React.Component {

    state = {
        schedule_data: null,
        stateCount: 0.0,
        paused: false,
        index: 0,
        url : null ,
        todayString : Def.getDateString(new Date(), "dd-MM-yyyy"),
        todayString_: Def.getDateString(new Date(), "yyyy-MM-dd"),
        user_count:1,
        item: this.props.route.params.item
      }

    constructor(props){
        super(props);
        console.log("class TVModal extends React.Component");
        console.log(this.props.route.params.item);
        this.feedbackBtnClick = this.feedbackBtnClick.bind(this);
        this.onChannelSuccess     = this.onChannelSuccess.bind(this);
        this.onChannelFailed     = this.onChannelFailed.bind(this);

        this.requestsCalendar     = this.requestsCalendar.bind(this);
        this.onFailToRecieveAd  = this.onFailToRecieveAd.bind(this);
        this.onEnd     = this.onEnd.bind(this);
        this.onLoad  = this.onLoad.bind(this);
        Def.global_player_stop();
        Def.stopPlay();
        this.ccuSuccess               = this.ccuSuccess.bind(this);
        this.ccuFailed                = this.ccuFailed.bind(this);
        NetChannel.coundCCU(this.ccuSuccess,this.ccuFailed,this.props.route.params.item.id);

        //this.props.route.params.item.id
        this.requestsCalendar(this.state.todayString);
        let timer = setInterval(this.tick, 5*60*1000);
        this.setState({timer});
    }

    tick =() => {
      NetChannel.coundCCU(this.ccuSuccess,this.ccuFailed,this.props.route.params.item.id);
    }
    ccuSuccess(data){
        console.log("data");
        console.log(data["data"]["count"]);
        this.setState({ user_count: data["data"]["count"]  });
    }
    ccuFailed(data){
        console.log("ccuFailed");
        console.log(data);
    }

    _onOrientationDidChange = (orientation) => {
        if (orientation == 'PORTRAIT') {
            Orientation.lockToLandscapeLeft();
        }
        };
    componentWillUnmount() {
        //Orientation.unlockAllOrientations()
        Orientation.removeOrientationListener(this._onOrientationDidChange);
        }
    componentDidMount() {
        Orientation.lockToLandscapeLeft();
        Orientation.addOrientationListener(this._onOrientationDidChange);
        console.log("TVModal componentDidMount");
        Def.global_player_stop();
        Def.stopPlay();
    }

  onEnd() {
    console.log("TVModal onEnd");
    }

    onLoad() {
        console.log("TVModal onLoad");
        Def.global_player_stop();
        Def.stopPlay();
    }


    onChannelSuccess(data){
        console.log("on PlaybackModal Success");

        crrTime = Def.getDateString(new Date(), "HH:mm:ss");
        let allDataArr = data["data"][Object.keys(data["data"])[0]];

        if(allDataArr){

          let isPlaying = 0;
          for(let i = 0; i <allDataArr.length ; i++ ){
              if (isPlaying > 0){
                  isPlaying+=1;
                  allDataArr[i]["isPlaying"] = isPlaying;
              }
              if(allDataArr[i]["start_time"] <=crrTime && allDataArr[i]["end_time"] >= crrTime){
                  isPlaying = 1;
                  allDataArr[i]["isPlaying"] = 1;
              }
          }

          this.setState({ schedule_data: allDataArr });
        }

    }

    onChannelFailed(data){

    }
    requestsCalendar(dateStringDDMMYYYY){
        NetChannel.listBroadcast(this.onChannelSuccess,this.onChannelFailed,this.props.route.params.item.id,dateStringDDMMYYYY,dateStringDDMMYYYY);
    }

      pauseVideo = () => {
        if(this.player ) {
          this.setState({ paused: true });
        }
        console.log("pauseVideo");
        analytics().logEvent('video', {
          action: "pause"
        })

      }

      playVideo = () => {
        if(this.player ) {
          this.setState({ paused: false });
        }

        console.log("playVideo");

        analytics().logEvent('video', {
          action: "play"
        })

        analytics().logEvent('basket', {
          id: 3745092,
          item: 'mens grey t-shirt',
          description: ['round neck', 'long sleeved'],
          size: 'L',
        })

      }

      next=()=>{
        this.setState({ paused: false });
        this.setState({ index: (this.state.index+1 + this.state.urls.length) % this.state.urls.length});
      }

      prev=()=>{
        this.setState({ paused: false });
        this.setState({ index: (this.state.index-1 + this.state.urls.length) % this.state.urls.length});

      }


    feedbackBtnClick() {
        this.props.navigation.navigate('feedBackTv', {screen:'player'});
    }
    onFailToRecieveAd(error) {
        console.log("onFailToRecieveAd");
        console.log(error);
    }

    renderToolbar = () => (
      <View>
        <Text> toolbar </Text>
      </View>
    );
    getAdsSize(){
        let widthh = Math.floor(width);
        let heighth = 70;
        let rs = (widthh.toString()+ "x" + heighth.toString()).toString();
        return rs;

    }
 

    render() {


        analytics().setCurrentScreen(Def.DETAIL_TV);
        const {navigation} = this.props;
        const adUnitId = 'ca-app-pub-7876824592842049/2783230456';
        return (
            <View style={styles.container}>
                <Modal isVisible={true} style={styles.modal}>
                    <View style={{ flex: 1 }}>
                            <VideoPlayer
                            ref={ref => {this.player  = ref}}
                            resizeMode={"contain"}
                            navigator={this.props.navigator}
                            paused={this.state.paused}
                            source={{ uri:this.props.route.params.item.stream_path}}
                            onEnd={this.onEnd}
                            onLoad={this.onLoad}
                            onBack={()=>{
                                this.props.navigation.goBack();
                                this.props.route.params.play_again();
                                Orientation.removeOrientationListener(this._onOrientationDidChange);
                                Orientation.lockToPortrait();
                            }}
                            showOnStart={false}
                            playInBackground={true}
                            toggleResizeModeOnFullscreen={false}
                            onEnterFullscreen={()=>{
                                this.props.navigation.goBack();
                                this.props.route.params.play_again();
                                Orientation.removeOrientationListener(this._onOrientationDidChange);
                                Orientation.lockToPortrait();
                            }}
                            onExitFullscreen={()=>{
                                this.props.navigation.goBack();
                                this.props.route.params.play_again();
                                Orientation.lockToPortrait();
                            }}
                        />
                    </View>
                </Modal>
 
 
            </View>


        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex : 1,
      // marginBottom : 125,
        backgroundColor:  '#fff'

    },

    player: {
      justifyContent: 'center',
      width: width,
      height: height/3.3,
      backgroundColor: "#000",
    },  modal: {
        backgroundColor: 'white',
        margin: 0, // This is the important style you need to set
        alignItems: undefined,
        justifyContent: undefined,
      }
,    
    ads: {
       width : width,
       height : 70,
       justifyContent: "center",
       alignItems: "center",
    },
    body : {
      paddingHorizontal :15,
    },
    playList:{
      marginTop : 10,
    },

    groupMenu: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop : 20,
        paddingBottom:5

    },
    menuBtn:{
        flexDirection : 'row',
        alignItems:'center'

    },
    menuText: {
        fontSize:15,
        marginHorizontal:5,
    },
  });

export default TVModal;
