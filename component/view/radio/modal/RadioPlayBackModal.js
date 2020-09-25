import React from 'react';
import {Linking,View, Text, TouchableOpacity, StyleSheet, Dimensions , Share,Image} from 'react-native'
import DownIconSvg from '../../../../assets/icon/icon-down-black.svg'
import Carousel from 'react-native-snap-carousel';
import ListenerIcon from '../../../../assets/icon/icon-listener.svg';
import RandomPlayIcon from '../../../../assets/icon/icon-random.svg';
import RandomRedPlayIcon from '../../../../assets/icon/icon-random-red.svg';
import Def from '../../../../Def/Def'
import MusicPlayer from '../../common/MusicPlayer'
import debounce from 'lodash.debounce';
import NetSlide from '../../../../Net/NetSlide';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import Slider from '@react-native-community/slider';
import analytics from '@react-native-firebase/analytics';
import Pagination from "react-native-snap-carousel/src/pagination/Pagination";
import Style from "../../../../Def/Style";
import RadioPlayer from "../../common/RadioPlayer";
const {width, height} = Dimensions.get('window');

class RadioPlayBackModal extends React.Component{

    state = {
        slide_data:[],
        program_name_text:"Song",
        program:this.props.route.params.item,
        channel_name: "",
        listens:0,
        activeSlide: 0,
        value: 0,
        value_max: 100,
        playRandom:false,
    };



    constructor(props){
        super(props);
        this.interactBtnClick = this.interactBtnClick.bind(this);
        this.feedbackBtnClick = this.feedbackBtnClick.bind(this);
        this.shutdownAlarmClick = this.shutdownAlarmClick.bind(this);
        this.playbackClick = this.playbackClick.bind(this);

        this.onSlideSuccess         = this.onSlideSuccess.bind(this);
        this.onSlideFailed          = this.onSlideFailed.bind(this);
        this.goLink = this.goLink.bind(this);

        this.onPrev                     = this.onPrev.bind(this);
        this.onSlideMusic                     = this.onSlideMusic.bind(this);
        Def.onSlideMusic                     = this.onSlideMusic;

        this.onNext                     = this.onNext.bind(this);
        this.onShare                     = this.onShare.bind(this);
        this.handleChange                     = this.handleChange.bind(this);
        this.triggerChange                     = this.triggerChange.bind(this);
        Def.onPrevMusic                     = this.onPrev;
        Def.onNextMusic                     = this.onNext;
        this.setInfo                     = this.setInfo.bind(this);

        console.log(this.props.route.params.item);
        NetSlide.getSlides(this.onSlideSuccess,this.onSlideFailed);


        // Delay action 2 seconds
        this.onChangeDebounced = debounce(this.onChangeDebounced, 500)
    }

    handleInputChange = (value) => {


        try{

        // Immediately update the state
        this.setState({
            progress_value: value
          })

          // Execute the debounced onChange method
          this.onChangeDebounced(value)

        } catch (err) {
            console.log(err);
            return;
        }
      }

    onChangeDebounced = (progress_value) => {
        try{

            console.log(`onChangeDebounced ${progress_value}`);
            Def.seek(progress_value, 50);

        } catch (err) {
            console.log(err);
            return;
        }
      }

    handleChange(progress) {
        if(this.timer){
            clearTimeout(this.timer)
            this.timer = null;
        }
        this.timer = setTimeout(this.triggerChange(progress), 1000)
      }

      triggerChange(progress){
        console.log(`triggerChange ${progress}`);
      }
    onShare = async () => {
        try {
            const result = await Share.share({
              message:`Mời nghe chương trình ${this.state.program_name_text} trên app VOV Media`,
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


    onSlideMusic(current,max) {
        console.log(`onSlideMusic ${current} ${max}`);
        this.setState({value:current});
        this.setState({value_max:max});

        if(current != 0 && max !=0 && current == max)
            this.onNext();
        //

    }
    componentDidMount() {
        console.log("RadioPlaybackModal componentDidMount");
        this.setInfo(this.props.route.params.item);
        //Def.setItemMusic(this.props.route.params.item,this.props.route.params.data);
        //NetSlide.getSlides(this.onSlideSuccess,this.onSlideFailed);
    }

    setInfo(model){

        this.setState({listens:model.listens});
        this.setState({singer_name:model.channel_name});
        this.setState({program_name_text:model["program_name"]});
        this.setState({program:model});
    }

    onPrev(){
        console.log("onPrev()");
        const model = this.state.program;
        const all_data = this.props.route.params.data;

        // Kết thúc ở all_data.length-1 vì muốn next chương trình đó phải không là chương trình cuối cùng
        for(let i = 1; i <all_data.length ; i++ ){
            let currProgram = all_data[i];
            if(model && "id" in model && currProgram["id"] == model["id"]){
                this.setState({program_name_text:all_data[i-1]["name"]});
                this.setState({program:all_data[i-1]});
                Def.setItemMusic(all_data[i-1],all_data);
                this.setInfo(all_data[i-1]);
                return;
            }
        }

    }

    onNext(){
        console.log("onNext()");
        const model = this.state.program;
        const all_data = this.props.route.params.data;

        // Kết thúc ở all_data.length-1 vì muốn next chương trình đó phải không là chương trình cuối cùng
        for(let i = 0; i <all_data.length-1 ; i++ ){
            let currProgram = all_data[i];
            if(model && "id" in model && currProgram["id"] == model["id"]){
                this.setState({program_name_text:all_data[i+1]["name"]});
                this.setState({program:all_data[i+1]});
                Def.setItemMusic(all_data[i+1],all_data);
                this.setInfo(all_data[i+1]);
                return;
            }
        }

    }

    onSlideSuccess(data){
        console.log("onSlideSuccess");
        //console.log(data["data"]["slides"]);
        this.setState({ slide_data: data["data"]["slides"]  });
    }

    onSlideFailed(data){

    }

    onMusic(data){
        this.props.route.params.item.content_fullpath = data;
        console.log("onMusic(data)");

        Def.setItemMusic(this.props.route.params.item,this.props.route.params.data);

        this.setInfo(this.props.route.params.item);


    }

    onMusicFail(data) {

        console.log("onMusicFail(data)-Test");
        ////console.log(data);
    }

    interactBtnClick(){
        this.props.navigation.navigate('commonInteract', {screen:'player',item:this.props.route.params.item});
    }

    feedbackBtnClick() {
        this.props.navigation.navigate('feedback', {screen:'player'});
    }

    shutdownAlarmClick() {
        this.props.navigation.navigate('shutdownAlarm', {screen:'player'});
    }
    playbackClick() {
        this.props.navigation.navigate('playback', {screen:'player'});
    }


    goLink(link){
        //alert(link);
        if(link.startsWith("http")){
            Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
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
                inactiveDotOpacity={0.5}
                inactiveDotScale={1}
            />
        );
    }

    onSwipeUp(gestureState) {
        this.props.navigation.navigate('commonInteract', {screen:'player',item:this.props.route.params.item});
    }

    renderItem = ({item, index}) => {

        return (
            <View key={index} style={styles.cardStyle}>

                <TouchableOpacity onPress={ this.goLink.bind(this,item.url)} >
                    <Image  style = {[styles.cardImg, {resizeMode : 'stretch'}]} source={{ uri: item.image_url}} />
                </TouchableOpacity>
            </View>
        );

    }

    render() {

        const config = {
            velocityThreshold: 0.2,
            directionalOffsetThreshold: 120
        };

        analytics().setCurrentScreen(Def.DETAIL_MUSIC);
        const multiplier =  1.12;
        const maximumValue = this.state.value_max ;
        const logic = maximumValue * multiplier;
        const left =
        this.state.value >= 400
          ? (this.state.value * width) / logic - 29
          :
          this.state.value >= 350
            ? (this.state.value * width) / logic - 26
            :
          this.state.value >= 300
            ? (this.state.value * width) / logic - 23
            :
            this.state.value >= 250
              ? (this.state.value * width) / logic - 20
              :
              this.state.value >= 200
                ? (this.state.value * width) / logic - 17
                : this.state.value >= 150
            ? (this.state.value * width) / logic - 14
            : this.state.value >= 100
            ? (this.state.value * width) / logic - 11
            : (this.state.value * width) / logic - 8;

            console.log(`render ${this.state.value} ${this.state.value_max}`);


            if(parseInt(this.state.value) != 0 && parseInt(this.state.value_max) !=0 && parseInt(this.state.value) == parseInt(this.state.value_max)){
                //this.setState({value:0,value_max:0});
                this.onNext();
            }
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor:'#fff',
                }}>
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
                        {this.state.program_name_text}
                        </Text>
                    </View>

                </View>
                <View style={{flex: 1, justifyContent : 'space-between'}}>
                    <View style={styles.carousel}>
                            <Carousel
                                ref={(c) => { this._carousel = c; }}
                                // keyExtractor={(item, index) => `${item.id}`}
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
                        {this.pagination}
                    </View>

                    <GestureRecognizer
                        onSwipeUp={(state) => this.onSwipeUp(state)}
                        //onSwipeLeft={(state) => this.onSwipeLeft(state)}
                        //onSwipeRight={(state) => this.onSwipeRight(state)}
                        config={config}
                        style={{justifyContent : 'space-between', flex: 1}}
                    >


                    <View style={styles.playerContainer}>
                        <View/>
                        <View>
                        <View style={styles.songInfo}>
                            <Text style={styles.songName}>
                                {this.state.program_name_text}
                            </Text>
                            <Text style={styles.singleInfo} >
                                { this.state.channel_name }
                            </Text>
                        </View>
                        {

                            /*

                        <View style={styles.slide_text}>
                            <Text style={ { width: 50, textAlign: 'center', left: left,backgroundColor:'red' } }>
                                {('00'+parseInt(this.state.value/60)).slice(-2) + ":" +  ('00'+parseInt(this.state.value%60)).slice(-2)}
                            </Text>
                        </View>
                            */
                        }
                        <View>
                        <View style={styles.slide}>

                            <Slider
                                value={this.state.value}
                                onValueChange={value => {
                                    this.handleInputChange(value);
                                    //this.handleChange(value);
                                    //this.setState({ value:value },()=>{
                                    //    Def.seek(120, 50);
                                    //})

                                }}
                                minimumValue={0}
                                maximumValue={this.state.value_max}
                                minimumTrackTintColor="#FF0000"
                                maximumTrackTintColor="#a4a5a6"
                                thumbTintColor="FF0000"
                                //sliderValue= {('00'+parseInt(this.state.value/60)).slice(-2) + ":" +  ('00'+parseInt(this.state.value%60)).slice(-2)}
                                //
                                thumbImage= {require('./trans.png')}
                            />
                        </View>
                        <View style={{left: left +10,}}>
                            <Text style={styles.text}>
                                {('00'+parseInt(this.state.value/60)).slice(-2) + ":" +  ('00'+parseInt(this.state.value%60)).slice(-2)}
                            </Text>
                        </View>
                        </View>

                        <View style={styles.groupMenu}>
                            <TouchableOpacity style={styles.menuBtn}>
                                <ListenerIcon width={25} height={25}/>
                                <Text style={styles.menuText}>Lượt nghe: {this.state.listens}</Text>
                            </TouchableOpacity>
                            {/*<TouchableOpacity style={styles.menuBtn} onPress={() => {*/}
                                {/*this.setState({playRandom : !this.state.playRandom});*/}
                            {/*}} >*/}
                                {/*<Text style={[styles.menuText, {color: this.state.playRandom ? Style.DEFAUT_RED_COLOR : '#000'}]}>Phát ngẫu nhiên</Text>*/}
                                {/*{this.state.playRandom ?*/}
                                    {/*< RandomRedPlayIcon width={25} height={25}/>*/}
                                    {/*:*/}
                                {/*< RandomPlayIcon width={25} height={25}/>*/}
                                {/*}*/}

                            {/*</TouchableOpacity>*/}

                        </View>

                        <View style={styles.player}>
                            <MusicPlayer item={this.props.route.params.item} data={this.props.route.params.data} type={'radio'}  share={this.onShare}  back={this.onPrev} next={this.onNext}/>
                            {/*<RadioPlayer item={this.state.item} data={this.props.route.params.data} share={this.onShare}  back={this.onPrev} next={this.onNext }/>*/}

                        </View>
                        </View>
                    </View>

                    </GestureRecognizer>

                </View>
                <TouchableOpacity style={styles.commentBtn} onPress={this.interactBtnClick}>
                    <Text style={{color: '#fff', fontSize : Style.TITLE_SIZE, fontWeight:'bold'}}>
                        Bình luận
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
        maxHeight : width*0.95,
        borderRadius: 5,
        marginHorizontal : 10,
        // marginTop: 10,
        justifyContent:'center',

    },
    songName:{ fontSize: 20 , color:'#000' , fontWeight:'bold' },


    playerContainer: {
        marginTop:height *0.04,
        marginHorizontal:10,
        justifyContent : 'space-around',
        flex: 1,
        maxHeight: height *0.5,
        // paddingHorizontal: 5,
    },
    title:{
        fontSize: 18,
        color: Style.DEFAUT_RED_COLOR,
        fontWeight: 'bold',
        marginLeft: -20,
    },
    text: {
        marginTop : 15,
        paddingBottom:2,
        paddingTop:2,
        paddingLeft:10,
        fontSize: 10,
        justifyContent: 'center',
        color: '#fff',
        backgroundColor: '#f00',
        borderRadius: 10,
        alignItems: 'center',
        width: 45
    },
    groupMenu: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop : 7,
        paddingBottom:5

    },  slide: {
        flex: 1,
        marginLeft: -10,
        marginRight: -10,
        marginBottom : -34,
        paddingLeft:0,
        paddingRight:0,
        paddingTop:height *0.03,
        paddingBottom:10,
        alignItems: "stretch",
        justifyContent: "center",
        // backgroundColor: '#ff0000',
      },
    menuBtn:{
        flexDirection : 'row',
        alignItems:'center'

    },
    singleInfo: {
        marginTop: 10,
        fontSize:15,
    }
    ,
    menuText: {
      fontSize:15,
      marginHorizontal:5,
    },
    player: {
        marginTop:10,
    },
    commentBtn: {
        height:height * 0.05,
        minHeight:35,
        borderTopLeftRadius : 25,
        borderTopRightRadius : 25,
        backgroundColor : Style.DEFAUT_BLUE_COLOR,
        marginHorizontal: 10,
        justifyContent : 'center',
        paddingLeft: 20,
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



});

export default RadioPlayBackModal;
