import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, TextInput, FlatList, Modal, Button, TouchableWithoutFeedback} from 'react-native'
import DownIconSvg from '../../../../assets/icon/icon-down-black.svg'
import RadioMiniPlayer from '../../common/RadioMiniPlayer'
import CalendarIcon from '../../../../assets/icon/icon-calendar.svg';
import PlaybackItemrenderer from "../../item-render/PlaybackItemrenderer";

import analytics from '@react-native-firebase/analytics';
import {Calendar} from 'react-native-calendars';

import NetChannel from '../../../../Net/NetChannel'
import Def from '../../../../Def/Def'
import admob, { MaxAdContentRating ,BannerAd, BannerAdSize, TestIds} from '@react-native-firebase/admob';
import Style from "../../../../Def/Style";


const {width, height} = Dimensions.get('window');

const CalendarPopup = (props) => (
    <Modal onRequestClose={() => {props.closeFun(props.selectedDate)}} visible={props.visible} transparent={true} styles={{backgroundColor : '#green'}} >
        <TouchableOpacity style={styles.modalView} activeOpacity={1}  onPress ={ () => {props.closeFun(props.selectedDate)}}>
            <TouchableWithoutFeedback activeOpacity={1}  style={{width : 350, height :380, backgroundColor:'#fff', alignItems: "center",
                justifyContent : 'center', zIndex: 3}} onPress ={ (e) => {
                // props.closeFun(props.selectedDate)
                    console.log('prevent click');
                    e.preventDefault()
                }}>
             <View style={{width : 350, height :400, backgroundColor:'#fff', alignItems: "center",
                 justifyContent : 'center'}}>

                <Calendar
                // width={600}
                current={Def.getDateString(new Date(), "yyyy-MM-dd")}
                onDayPress={
                    (day) => {
                    console.log('selected day', day);
                    let date = new Date(day.timestamp);
                    props.closeFun(date);
                    props.requestsCalendar(Def.getDateString(date, "dd-MM-yyyy"));
                    }
                }
                onDayLongPress={(day) => {console.log('selected day', day)}}
                monthFormat={'yyyy MM'}
                onMonthChange={(month) => {console.log('month changed', month)}}

                markedDates={{
                    [props.selectedDate]: {
                        selected: true,
                        disableTouchEvent: true,
                        selectedColor: Style.DEFAUT_RED_COLOR,
                        selectedTextColor: '#fff'
                    }
                }}

                // hideArrows={true}
                // renderArrow={(direction) => (<Arrow/>)}
                // hideExtraDays={true}
                // disableMonthChange={true}
                firstDay={1}
                // hideDayNames={true}
                // showWeekNumbers={true}
                onPressArrowLeft={subtractMonth => subtractMonth()}
                onPressArrowRight={addMonth => addMonth()}
                // disableArrowLeft={true}
                // disableArrowRight={true}
                // disableAllTouchEventsForDisabledDays={true}

                // Specify style for calendar container element. Default = {}
                style={{
                    // borderWidth: 1,
                    width : 330,
                    height :330,
                    borderColor: 'gray',
                    zIndex: 5,
                    marginTop : -30,

                    // height: 350
                }}
                // Specify theme properties to override specific styles for calendar parts. Default = {}
                theme={{
                    backgroundColor: '#ffffff',
                    calendarBackground: '#ffffff',
                    textSectionTitleColor: '#b6c1cd',
                    textSectionTitleDisabledColor: '#d9e1e8',
                    selectedDayBackgroundColor: '#00adf5',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#00adf5',
                    dayTextColor: '#2d4150',
                    textDisabledColor: '#d9e1e8',
                    dotColor: '#00adf5',
                    selectedDotColor: '#ffffff',
                    arrowColor: Style.DEFAUT_RED_COLOR,
                    disabledArrowColor: '#d9e1e8',
                    monthTextColor: Style.DEFAUT_RED_COLOR,
                    indicatorColor: 'blue',
                    textDayFontFamily: 'monospace',
                    textMonthFontFamily: 'monospace',
                    textDayHeaderFontFamily: 'monospace',
                    textDayFontWeight: '300',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '300',
                    textDayFontSize: 16,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 16
                }}


                    />
             </View>
            </TouchableWithoutFeedback>
        </TouchableOpacity>
    </Modal>);
const dayInWeek = ['Chủ nhật','Thứ 2', 'Thứ 3','Thứ 4', 'Thứ 5','Thứ 6', 'Thứ 7' ];

class PlaybackModal extends React.Component{


    state = {
        schedule_data: null,
        stateCount: 0.0,
        todayString : Def.getDateString(new Date(), "dd-MM-yyyy"),
        todayString_: Def.getDateString(new Date(), "yyyy-MM-dd"),
        modalVisible: false,
        today: (new Date()).setHours(0,0,0,0) ,
        selectedDate: (new Date()).setHours(0,0,0,0),
        current_program: null,
        current_index : 0,
        dateStringDDMMYYYY:Def.getDateString(new Date(), "dd-MM-yyyy")
    };

    getItemLayout = (data, index) => (
        { length: 45, offset: 45 * index, index }
    )



    onChannelSuccess(data){
        console.log("on onChannelSuccess Success");

        if(data["data"].length == 0){
            this.setState({ schedule_data: null,current_index:0 });
            return;
        }

        crrTime = Def.getDateString(new Date(), "HH:mm:ss");
        let allDataArr = data["data"][Object.keys(data["data"])[0]];

        let isPlaying = 0;
        for(let i = 0; i <allDataArr.length ; i++ ){
            if (isPlaying > 0){

                if(this.state.dateStringDDMMYYYY == this.state.todayString)
                    allDataArr[i]["isPlaying"] = 2;
            }
            if(allDataArr[i]["start_time"] <=crrTime && allDataArr[i]["end_time"] >= crrTime){
                isPlaying = 1;
                if(this.state.dateStringDDMMYYYY == this.state.todayString)
                    allDataArr[i]["isPlaying"] = 1;
                this.setState({current_program:allDataArr[i], current_index : i});
            }
        }
        console.log(allDataArr);
        this.setState({ schedule_data: allDataArr });
    }

    onChannelFailed(data){

    }


    constructor(props){
        super(props);
        this.setModalVisible = this.setModalVisible.bind(this);
        this.closeFunction = this.closeFunction.bind(this);
        let currentDate = new Date();
        console.log(currentDate.toDateString());


        this.onChannelSuccess     = this.onChannelSuccess.bind(this);
        this.onChannelFailed     = this.onChannelFailed.bind(this);

        this.requestsCalendar     = this.requestsCalendar.bind(this);

        this.requestsCalendar(this.state.todayString);

    }

    // state = {
    //     modalVisible: false
    // };

    requestsCalendar(dateStringDDMMYYYY){
        this.setState({dateStringDDMMYYYY:dateStringDDMMYYYY});
        NetChannel.listBroadcast(this.onChannelSuccess,this.onChannelFailed,this.props.route.params.id,dateStringDDMMYYYY,dateStringDDMMYYYY);
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    };

    closeFunction =(selectDate)=> {
        console.log('close function');
        this.setState({modalVisible : false, selectedDate:selectDate});
    };

    // scrollToIndex = (index) => {
    //     console.log('Scroll to item : ' + index);
    //     this.flatListRef.scrollToIndex({animated: true, index: index});
    // }

    scrollToItem = () => {
        // let randomIndex = Math.floor(Math.random(Date.now()) * this.state.schedule_data.length);

        if(this.state.schedule_data.length >= this.state.current_index){
            this.flatListRef.scrollToIndex({animated: true, index: this.state.current_index});
        }
    }

    componentDidMount() {
        let wait = new Promise((resolve) => setTimeout(resolve,300));
        wait.then( () => {
             if(this.state.schedule_data)
                 this.scrollToItem();
        });
    }



    convertDateToString = (date) => {
        let day = dayInWeek[date.getDay()] + ', ngày ' + date.toISOString().slice(0,10).split("-")[2]+"/"+date.toISOString().slice(0,10).split("-")[1]+"/"+date.toISOString().slice(0,10).split("-")[0];
        return day;
    }

    getAdsSize(){
        let widthh = Math.floor(width - 25);
        let heighth = 70;
        let rs = (widthh.toString()+ "x" + heighth.toString()).toString();
        return rs;

    }



    render() {

        analytics().setCurrentScreen(Def.DETAIL_RADIO);
        const { modalVisible } = this.state;
        const renderItem = ({ item }) => (
            <PlaybackItemrenderer item={item} />
        );
        return (
            <View style={{flex:1, paddingBottom :5, backgroundColor:'#fff'}}>
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
                            Lịch Phát Sóng / Nghe Lại
                        </Text>
                    </View>
                </View>
                <View style={styles.body}>

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
                    <View style={styles.content}>
                        <View >
                            <TouchableOpacity style={styles.selectDateBtn} onPress={() => {
                                this.setModalVisible(true);
                            }}>
                                <CalendarIcon width={25} height={25}/>
                                <Text style={styles.selectDateText}>{this.state.selectedDate == this.state.today ? 'Hôm nay' : this.convertDateToString(this.state.selectedDate)}</Text>

                            </TouchableOpacity>
                            <View style={styles.underline}></View>

                        </View>


                    </View>
                </View>
                <View>
                    <CalendarPopup visible={modalVisible} animationType="slide" closeFun={this.closeFunction} requestsCalendar={this.requestsCalendar} selectedDate={this.state.selectedDate}
                                   transparent={true}/>
                </View>


                <View style={styles.playList}>
                    <FlatList
                        style={{ marginBottom : 0, paddingLeft : 10}}
                        ref={(ref) => { this.flatListRef = ref; }}
                        data={this.state.schedule_data}
                        renderItem={renderItem}
                        keyExtractor={item => (item.id + "")}
                        // initialScrollIndex={1}
                        // initialNumToRender={2}
                        getItemLayout={this.getItemLayout}

                    />
                </View>


                <View  style={{position:'absolute',left: 0, right: 0, bottom: 1, zIndex:10}}>
                    {
                        <RadioMiniPlayer item={this.props.route.params.program}/>
                    }

                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    body : {
        marginHorizontal : 10,
    },
    modalView : {
        // marginHorizontal: 10,
         marginTop : 50,
        // backgroundColor: "red",
        // borderRadius: 20,
        padding: 5,
        paddingVertical : 10,
        alignItems: "center",
        justifyContent : 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        height :height,
        width : width,
        shadowOpacity:1,
        shadowRadius: 3.84,
        // elevation: 2
        flex: 1,
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
    playList:{
      flex : 1,
      marginBottom :50,
      padding:5
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
    selectDateBtn:{
        paddingLeft :10,
        flexDirection : 'row',
        alignItems:'center',
        // borderBottomWidth:1,
        // borderBottomColor : Style.GREY_TEXT_COLOR,
        // paddingBottom :10
        // paddingBottom: 10

    },
    selectDateText: {
        fontSize: 16,
        color: '#b3b3b3',
        marginHorizontal:5,
        marginLeft: 10,
    },

    ads : {
        justifyContent: 'center',
        height: 70,
        borderRadius: 5,
        marginVertical : 5,
    },
    feedBackInput : {
        color: '#b3b3b3',
        fontSize : 15,
        height: 45, paddingHorizontal : 5 , borderColor: 'gray', backgroundColor : '#f0f0f0', borderWidth: 1 ,  borderRadius : 8, marginVertical: 5,
    },
    feedBackContent: {
        color: '#b3b3b3',
        height : 100,
        fontSize : 15,
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
        height: 45,width : 0.2 * width, backgroundColor : '#e61e1e', borderRadius : 8, justifyContent:'center', alignItems: 'center'
    },
    speakBtn :{
        width : width - 20,
        marginVertical : 5,
        height: 45, backgroundColor : '#00a54b', borderRadius : 8, justifyContent:'center', alignItems: 'center'
    },
    adsSlider: {
        justifyContent: 'center',
        paddingTop: 5,
        padding: 8,
        height: 100,
        borderRadius: 5,
        backgroundColor: "#e6e6e6",
        marginRight : 15
    },

    underline : {
        // borderBottomColor: '#e61e1e',
        borderBottomWidth: 2,
        height :1,
        width :width *0.9,
        marginTop : 10,
        alignSelf : 'center'
        // marginBottom:15
    },

});

export default PlaybackModal;
