import React, {PureComponent} from 'react'
import {Text, View, Button, StyleSheet, Dimensions, SafeAreaView, FlatList, TouchableOpacity} from 'react-native'
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

class PlayTvScreen extends React.Component {

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
        console.log("class PlayTvScreen extends React.Component");
        console.log(this.props.route.params.item);
        this.feedbackBtnClick = this.feedbackBtnClick.bind(this);
        this.onChannelSuccess     = this.onChannelSuccess.bind(this);
        this.onChannelFailed     = this.onChannelFailed.bind(this);

        this.requestsCalendar     = this.requestsCalendar.bind(this);
        this.onFailToRecieveAd  = this.onFailToRecieveAd.bind(this);
        this.onEnterFullscreen = this.onEnterFullscreen.bind(this);
        this.onEnd     = this.onEnd.bind(this);
        this.onLoad  = this.onLoad.bind(this);
        this.playAgain =  this.playAgain.bind(this);
        Def.global_player_stop();
        Def.stopPlay();
        this.ccuSuccess               = this.ccuSuccess.bind(this);
        this.ccuFailed                = this.ccuFailed.bind(this);
        NetChannel.coundCCU(this.ccuSuccess,this.ccuFailed,this.props.route.params.item.id);

        //this.props.route.params.item.id
        this.requestsCalendar(this.state.todayString);
        let timer = setInterval(this.tick, 5*60*1000);
        this.setState({timer});
        Orientation.lockToPortrait();
    }

    tick =() => {
      Orientation.lockToPortrait();
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
   
        Orientation.lockToPortrait();
    
    };
  componentWillUnmount() {
      //Orientation.unlockAllOrientations()
      Orientation.removeOrientationListener(this._onOrientationDidChange);
    }
  componentDidMount() {
      Orientation.lockToPortrait();
      Orientation.addOrientationListener(this._onOrientationDidChange);
      console.log("PlayTvScreen componentDidMount");
    Def.global_player_stop();
    Def.stopPlay();
}
  onEnd() {
    console.log("PlayTvScreen onEnd");
}

onLoad() {
    console.log("PlayTvScreen onLoad");
    Def.global_player_stop();
    Def.stopPlay();
}
componentDidMount() {
  const { navigation } = this.props;
  this.focusListener = navigation.addListener("didFocus", () => {
    console.log("didFocus");
  });
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

      playAgain(){
        this.setState({ paused: false });
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
    onEnterFullscreen(){ 
      this.props.navigation.navigate('tvmodal', {item:this.props.route.params.item,play_again:this.playAgain});
      this.setState({paused:true});
    }

    render() {


        analytics().setCurrentScreen(Def.DETAIL_TV);
        const {navigation} = this.props;
        const adUnitId = 'ca-app-pub-7876824592842049/2783230456';
        return (
            <View style={styles.container}>
                <View  style={styles.player} >

                  <VideoPlayer
                    ref={ref => {this.player  = ref}}
                    resizeMode={"contain"}
                    navigator={this.props.navigator}
                    paused={this.state.paused}
                    source={{ uri:this.props.route.params.item.stream_path}}
                    onEnd={this.onEnd}
                    onLoad={this.onLoad}
                    showOnStart={false}
                    playInBackground={false}
                    onEnterFullscreen={this.onEnterFullscreen}
                    onExitFullscreen={this.onEnterFullscreen}
                  />


                </View>



                <View style={styles.ads}>
                        <BannerAd
                            unitId={TestIds.BANNER}
                            size={this.getAdsSize()}
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




                <View style={styles.body}>


                    <View style={styles.groupMenu}>

                        <TouchableOpacity style={styles.menuBtn}>
                            <ListenerIcon width={25} height={25}/>
                            <Text style={styles.menuText}>{this.state.user_count} người đang xem</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuBtn} onPress={this.feedbackBtnClick}>
                            <Text style={styles.menuText}>Gửi phản hồi</Text>
                            <FeedbackIcon width={25} height={25}/>
                        </TouchableOpacity>

                    </View>


                    <View style={styles.playList}>
                        <FlatList
                            style={{ marginBottom : 60}}
                            data={this.state.schedule_data}
                            renderItem={renderItem}
                            keyExtractor={item => (item.id + "")}

                        />
                    </View>
                </View>

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
    },
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

export default PlayTvScreen;
