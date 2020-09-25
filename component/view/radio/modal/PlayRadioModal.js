import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, Share,Image,Linking} from 'react-native'
import DownIconSvg from '../../../../assets/icon/icon-down-black.svg'
import Carousel from 'react-native-snap-carousel';
import TextTicker from 'react-native-text-ticker'
import ListenerIcon from '../../../../assets/icon/icon-listener.svg';
import ShutdownTimer from '../../../../assets/icon/icon-sleep-time.svg';
import FeedbackIcon from '../../../../assets/icon/icon-feedback.svg';
import Calendar from '../../../../assets/icon/icon-calendar.svg';

import RadioPlayer from '../../common/RadioPlayer'
import Def from '../../../../Def/Def'
import NetChannel from '../../../../Net/NetChannel'
import NetSlide from '../../../../Net/NetSlide';
import Pagination from "react-native-snap-carousel/src/pagination/Pagination";
import NetDailyContent from '../../../../Net/NetDailyContent';

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import Style from "../../../../Def/Style";



const {width, height} = Dimensions.get('window');
class AlarmButton  extends React.Component{
    constructor(props){
        super(props);
        this.state =  {
            remainingTime: this.props.remainingTime,
            label: this.props.remainingTime ? 'Tắt sau' : 'Hẹn giờ tắt',
            playId : this.props.playId,
            is_updated:true,
            timer : null
        }
        this.alarmClick = this.alarmClick.bind(this);
        this.checkSchedule = this.checkSchedule.bind(this);

        let timer = setInterval(this.checkSchedule, 1*10*1000);
        this.setState({timer});


    }

    checkSchedule =() => {

        if (Def.timestampSchedule) {
            console.log("check schedule " + Def.schedule + "---" + Def.timestampSchedule);
            let now =   ( new Date()).getTime();
            let seconds = Def.timestampSchedule - Math.floor(now / 1000);
            this.setState({remainingTime : this.converSecondToMinutes(seconds), label :'Tắt sau'});
        }
    }

    converSecondToMinutes(seconds){
        let h = Math.floor(seconds/3600);
        let m = Math.floor((seconds - h*3600)/60);
        let hstr = h >= 10 ? "" + h : "0"+h;
        let mstr = m >= 10 ? ""+ m:"0" + m;
        return hstr+ ":" + mstr;
    }

    alarmClick(){
        this.props.navigation.navigate('shutdownAlarm', {screen:'player',id:this.state.playId});

    }

    componentDidMount(){
        this.checkSchedule();
    }

    // componentDidUpdate(){
    //     if (Def.schedule) {
    //         this.setState({remainingTime : Def.schedule});
    //     }
    //     return true;
    // }



    render(){
        return (
            <TouchableOpacity style={styles.menuBtn} onPress={this.alarmClick}>
                <Text style={styles.menuText}>{this.state.label}</Text>
                <Text style={styles.remainingTime}>{(this.state.remainingTime > 0 || this.state.remainingTime != "") ? this.state.remainingTime : ''}</Text>
                <ShutdownTimer width={25} height={25}/>

            </TouchableOpacity>
        );
    }
}

class PlayRadioModal extends React.Component{
    state = {
        schedule_data: null,
        stateCount: 0.0,
        ti_gia_text : "" ,
        program_name_text : "" ,
        program : null,
        all_program : [],
        slide_data:[],
        activeSlide: 0,
        user_count:1,
        item:this.props.route.params.item,
        timer: null,
        running_text_item: []
    };

    constructor(props){
        super(props);
        console.log("PlayRadioModal");
        this.tigiaSuccess               = this.tigiaSuccess.bind(this);
        this.tigiaFailed                = this.tigiaFailed.bind(this);
        this.ccuSuccess               = this.ccuSuccess.bind(this);
        this.ccuFailed                = this.ccuFailed.bind(this);

        this.interactBtnClick           = this.interactBtnClick.bind(this);
        this.feedbackBtnClick           = this.feedbackBtnClick.bind(this);
        this.shutdownAlarmClick         = this.shutdownAlarmClick.bind(this);
        this.playbackClick              = this.playbackClick.bind(this);


        this.requestsCalendar           = this.requestsCalendar.bind(this);

        this.onCalendarSuccess          = this.onCalendarSuccess.bind(this);
        this.onCalendarFailed           = this.onCalendarFailed.bind(this);

        this.onSlideSuccess             = this.onSlideSuccess.bind(this);
        this.onSlideFailed              = this.onSlideFailed.bind(this);
        this.runningText = this.runningText.bind(this);
        this.onPrev                     = this.onPrev.bind(this);
        this.onNext                     = this.onNext.bind(this);
        this.onShare                     = this.onShare.bind(this);
        Def.onPrevRadio                     = this.onPrev;
        Def.onNextRadio                     = this.onNext;
        this.openLink                   = this.openLink.bind(this);



        this.requestsCalendar(Def.getDateString(new Date(), "dd-MM-yyyy"));
        NetChannel.runningText(this.tigiaSuccess,this.tigiaFailed,this.state.item.id);
        NetSlide.getSlidesByChannel(this.onSlideSuccess,this.onSlideFailed,this.state.item.id);

        NetChannel.coundCCU(this.ccuSuccess,this.ccuFailed,this.state.item.id);

        let timer = setInterval(this.tick, 5*60*1000);
        this.setState({timer});

        this.props.navigation.addListener(
            'didFocus',
            payload => {
                console.log("Payload is called .....................")
                this.setState({is_updated:true});
            }
        );



    }

    componentDidMount(){
        console.log("Component did mount");
        this.props.navigation.addListener(
            'didFocus',
            payload => {
                console.log("Payload is called .....................")
                this.setState({is_updated:true});
            }
        );
    }

    requestsCalendar(dateStringDDMMYYYY){
        this.setState({program_name_text:""});
        NetChannel.listBroadcast(this.onCalendarSuccess,this.onCalendarFailed,this.state.item.id,dateStringDDMMYYYY,dateStringDDMMYYYY);
    }

    tick =() => {
        NetChannel.coundCCU(this.ccuSuccess,this.ccuFailed,this.state.item.id);
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
    onSlideSuccess(data){
        console.log("onSlideSuccess");
        console.log(data["data"] );
        this.setState({ slide_data: data["data"]  });
    }

    onSlideFailed(data){

    }

    onPrev(){
        console.log("onPrev()");
        console.log(this.props.route.params.data);
        console.log(this.props.route.params.item);


        for(let i = 1; i <this.props.route.params.data.length ; i++ ){
            let currItem = this.props.route.params.data[i];
            let prevItem = this.props.route.params.data[i-1];
            if(currItem.id == this.state.item.id){
                this.setState({item:prevItem},()=>{
                    Def.setItemRadio(this.state.item,this.props.route.params.data);
                    this.requestsCalendar(Def.getDateString(new Date(), "dd-MM-yyyy"));
                });
                break;
            }
        }

    }

    onNext(){
        console.log("onNext()");
        console.log(this.props.route.params.data);
        console.log(this.props.route.params.item);

        for(let i = 0; i <this.props.route.params.data.length-1; i++ ){
            let currItem = this.props.route.params.data[i];
            let nextItem = this.props.route.params.data[i+1];
            console.log(`${currItem.id} - ${this.state.item.id} - ${i}`);
            if(currItem.id == this.state.item.id){
                console.log(`${currItem.id} - ${this.state.item.id} - ${nextItem.id} - ${i}`);
                this.setState({item:nextItem},()=>{
                    Def.setItemRadio(this.state.item,this.props.route.params.data);
                    this.requestsCalendar(Def.getDateString(new Date(), "dd-MM-yyyy"));
                });
                break;
            }
        }



    }

    onShare = async () => {
        try {
            const result = await Share.share({
              message:
                this.state.share_text,
            });
            if (result.action === Share.sharedAction) {
              if (result.activityType) {
                // shared with activity type of result.activityType
              } else {
                // shared
              }
            } else if (result.action === Share.dismissedAction) {
              // dismissed
            }
          } catch (error) {
            alert(error.message);
          }
    }

    onCalendarSuccess(data){
        console.log("on onCalendarSuccess");
        //console.log(data["data"][Object.keys(data["data"])[0]]);
        crrTime = Def.getDateString(new Date(), "HH:mm:ss");

        let allDataArr = data["data"][Object.keys(data["data"])[0]];

        if(allDataArr)
            this.setState({
                all_program:allDataArr
            }, () => {

                for(let i = 0; i <allDataArr.length ; i++ ){
                    let currProgram = allDataArr[i];
                    if(currProgram["start_time"] <=crrTime && currProgram["end_time"] >= crrTime){
                        this.setState({program_name_text:currProgram["name"]});
                        this.setState({program:currProgram});
                        this.setState({share_text:`Mời bạn xem chương trình ${currProgram["name"]} lúc ${currProgram["start_time"]} trên kênh ${this.state.item.name}`});


                        break;
                    }
                }
            });





    }


    onCalendarFailed(data){

    }

    runningText(){

    }

    tigiaSuccess(data){
        console.log("tigiaSuccess");
        this.setState({running_text_item:data["data"]},
        ()=>{
            let ti_gia_text_ = "";

            if(data["data"]["type"] == "Text")
                ti_gia_text_ = data["data"]["content"]
            else{
                for(let i =0; i < data["data"]["content"].length; i++){
                    if(i>=5) break;
                    ti_gia_text_ +=  data["data"]["content"][i]["title"] + "  |  ";
                    //ti_gia_text_ += ` ${data["items"][i]["type"]}  - mua vào:  ${data["items"][i]["muatienmat"].replace(/\B(?=(\d{3})+(?!\d))/g, ".")}  - bán ra:  ${data["items"][i]["bantienmat"].replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ` ;
                }
            }


            this.setState({ti_gia_text:ti_gia_text_});

        });



    }

    tigiaFailed(data) {
        console.log("tigiaFailed");
        //console.log(data);


    }


    interactBtnClick(){
        this.props.navigation.navigate('commonInteract', {screen:'player',id:this.state.item.id,program_id:this.state.program && this.state.program.id ? this.state.program.id: -1 });
    }

    feedbackBtnClick() {
        this.props.navigation.navigate('feedback', {screen:'player',id:this.state.item.id});
    }

    shutdownAlarmClick = ()=> {
        this.props.navigation.navigate('shutdownAlarm', {screen:'player',id:this.state.item.id});
    }

    shutdownAlarmFunClick = ()=> {
        console.log('click');
    }
    playbackClick() {
        this.props.navigation.navigate('playback', {screen:'player',id:this.state.item.id,program:this.state.program});
    }

    onSwipeUp(state) {
        this.props.navigation.navigate('commonInteract', {screen:'player',id:this.state.item.id,program_id:this.state.program && this.state.program.id ? this.state.program.id: -1 });
    }
    onSwipeLeft(state) {
        this.props.navigation.navigate('playback', {screen:'player',id:this.state.item.id,program:this.state.program});
    }
    onSwipeRight(state) {
        this.props.navigation.navigate('feedback', {screen:'player',id:this.state.item.id});
    }




    openLink(link){
       //alert(link);
       if(link.startsWith("http")){
            Linking.openURL(link).catch(err => console.error("Couldn't load page", err));
        } else if(link.startsWith("vov://channel")){
            id = link.replace("vov://channel/",'');
            //alert(`channel ${id}`);


            if(Def.channels_data_radio)
                Object.entries(Def.channels_data_radio).map((prop, key) => {

                    for(let i = 0; i < prop[1].length; i++){
                        console.log(`${prop[1][i]['id']} - ${id}`);
                        if(parseInt(prop[1][i]['id']) == parseInt(id)){
                            Def.setItemRadio(prop[1][i],prop[1]);
                            Def.mainNavigate.navigate('PlayRadio', {screen:'commonPlayRadio', params: { item: prop[1][i], data : prop[1] }});
                        }
                    }
                });


            //NetChannel.getChannelById(this.onChannelSuccess,this.onChannelErr,id);
            //
        }else if(link.startsWith("vov://program")){
            id = link.replace("vov://program/",'');

            //alert(`program ${id}`);
            NetDailyContent.getContent(onProgramSuccess,onProgramErr,id);
        }
    }

    get pagination () {
        const { slide_data, activeSlide } = this.state;
        return (
            <Pagination
                dotsLength={slide_data.length}
                activeDotIndex={activeSlide}
                containerStyle={{ position:'absolute',top : 5, right : 0, width : slide_data.length  * 5,  paddingVertical: 5  }}
                dotContainerStyle={{marginHorizontal : 6,}}
                dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    borderWidth : 1,
                    backgroundColor : 'rgba(179, 179, 179, 0.92)',
                }}
                inactiveDotStyle={{

                    backgroundColor: 'rgba(255, 255, 255, 0.92)'
                }}
                inactiveDotOpacity={1}
                inactiveDotScale={1}
            />
        );
    }
    renderItem = ({item, index}) => {

        return (
            <View key={index} style={styles.cardStyle}>

                <TouchableOpacity onPress={ this.openLink.bind(this,item.url)} >
                    <Image  style = {[styles.cardImg, {resizeMode : 'stretch'}]} source={{ uri: item.image_fullpath}} />
                </TouchableOpacity>
            </View>
        );

    }

    render() {
        const config = {
            velocityThreshold: 0.2,
            directionalOffsetThreshold: 80
        };
        return (
                <View style={{
                    flex: 1,
                    backgroundColor: '#fff'
                }}>
                <View style={styles.header}>
                    <TouchableOpacity style={{justifyContent:'center',  paddingLeft: 10, width:50}}
                                      onPress={() => {
                                           this.props.navigation.goBack();
                                      }}
                    >
                        <DownIconSvg width={25} height={25} />
                    </TouchableOpacity>
                    <View style={{ justifyContent: 'center',marginLeft: 30}}>
                        <Text style={styles.title}>
                            {this.state.item.name }
                        </Text>
                    </View>

                </View>
                <View style={{flex: 1}}>
                        <View style={styles.carousel}>
                                <Carousel
                                    ref={(c) => { this._carousel = c; }}
                                    // keyExtractor={(item, index) => `${item.id}--${item.index}`}
                                    data={this.state.slide_data}
                                    renderItem={this.renderItem}
                                    itemWidth={width -20}
                                    sliderWidth={width -20}
                                    inactiveSlideOpacity={1}
                                    inactiveSlideScale={1}
                                    activeSlideAlignment={'start'}
                                    loop={true}
                                    autoplay={true}
                                    autoplayInterval={5000}
                                    onSnapToItem={(index) => this.setState({ activeSlide: index }) }
                                />
                                { this.pagination }
                        </View>
                    <GestureRecognizer
                        onSwipeUp={(state) => this.onSwipeUp(state)}
                        onSwipeLeft={(state) => this.onSwipeLeft(state)}
                        onSwipeRight={(state) => this.onSwipeRight(state)}
                        config={config}
                        style={{justifyContent : 'space-between', flex: 1}}
                    >
                        <View style={styles.textSlide}>
                            <TextTicker
                                style={{ fontSize: Style.MIDLE_SIZE , color:'#fff' }}
                                scrollSpeed={100}
                                loop

                                repeatSpacer={0}
                                marqueeDelay={0}
                            >
                                {
                                    this.state.ti_gia_text
                                }
                            </TextTicker>
                        </View>

                    <View style={styles.playerContainer}>
                        <TextTicker
                            style={{ fontSize: 20 , color:'#000' , fontWeight:'bold' }}
                            scrollSpeed={200}
                            loop
                            bounce
                            repeatSpacer={50}
                            marqueeDelay={1000}
                        >
                            {this.state.program_name_text}
                        </TextTicker>
                        <View style={styles.groupMenu}>
                            <TouchableOpacity style={styles.menuBtn}>
                                <ListenerIcon width={25} height={25}/>
                                <Text style={styles.menuText}>{this.state.user_count} người đang nghe</Text>
                            </TouchableOpacity>
                            {/*<TouchableOpacity style={styles.menuBtn} onPress={this.shutdownAlarmClick}>*/}
                                {/*<Text style={styles.menuText}>Hẹn giờ tăt</Text>*/}
                                {/*<ShutdownTimer width={25} height={25}/>*/}

                            {/*</TouchableOpacity>*/}

                            <AlarmButton
                                // shutdownAlarmFun={this.shutdownAlarmFunClick}
                                remainingTime={0}
                                playId={this.state.item.id}
                                navigation={this.props.navigation}
                            />

                        </View>

                        <View style={styles.player}>
                            <RadioPlayer item={this.state.item} data={this.props.route.params.data} share={this.onShare}  back={this.onPrev} next={this.onNext }/>
                        </View>

                        <View style={styles.groupMenu}>
                            <TouchableOpacity style={styles.menuBtn} onPress={this.feedbackBtnClick}>
                                <FeedbackIcon width={25} height={25} color={'red'}/>
                                <Text style={styles.menuText}>Gửi phản hồi</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuBtn} onPress={this.playbackClick}>
                                <Text style={styles.menuText}>Lịch phát sóng/nghe lại</Text>
                                <Calendar width={25} height={25}/>

                            </TouchableOpacity>

                        </View>


                    </View>
                    </GestureRecognizer>
                </View>
                <TouchableOpacity style={styles.commentBtn} onPress={this.interactBtnClick}>
                    <Text style={{color: '#fff', fontSize : Style.TITLE_SIZE, fontWeight:'bold'}}>
                        Tương tác / Bình luận
                    </Text>
                </TouchableOpacity>
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
    carousel: {
        paddingVertical: 2,
        // padding: 8,
        // height: width*1,
        maxHeight : width*0.95,
        borderRadius: 5,
        marginHorizontal : 10,
        // marginTop: 10,
        justifyContent:'center',

    },
    textSlide:{
        marginTop:5,
        height:35,
        borderRadius: 5,
        width: width -20,
        marginHorizontal: 10,
        backgroundColor: '#1288c9',
        justifyContent:'center',
        paddingHorizontal:5,
        alignItems: 'center',

    },


    playerContainer: {
        marginTop:10,
        marginHorizontal:10,
        paddingHorizontal: 5,
    },
    title:{
        fontSize: 18,
        color: Style.DEFAUT_RED_COLOR,
        fontWeight: 'bold',
        marginLeft: -20,
    },
    groupMenu: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop : 5,
        paddingBottom:5

    },
    menuBtn:{
        flexDirection : 'row',
        alignItems:'center'

    },
    menuText: {
      fontSize:Style.MIDLE_SIZE,
      marginHorizontal:5,
    },
    player: {
        // height : 100,
    },
    commentBtn: {
        height:35,
        borderTopLeftRadius : 25,
        borderTopRightRadius : 25,
        backgroundColor : Style.DEFAUT_BLUE_COLOR,
        marginHorizontal : 10,
        // marginVertical : 10,
        // alignItems : 'center',
        justifyContent : 'center',
        paddingLeft: 20,
        width : width - 20,
        marginTop :10,

    },
    cardStyle: {
        justifyContent: 'center',
        alignItems: 'center',

    },
    cardImg: {
        width: width-20,
        height: height * 0.5,
        borderRadius : 5,
    },
    remainingTime : {
        fontSize:Style.MIDLE_SIZE,
        marginHorizontal:5,
        color: 'green'
    }



});

export default PlayRadioModal;
