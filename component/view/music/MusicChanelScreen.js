import React, {PureComponent} from 'react'
import {Text, View, Button, StyleSheet, Dimensions, ScrollView, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback} from 'react-native'
import SortIcon from "../../../assets/icon/icon-sort.svg";
import admob, { MaxAdContentRating ,BannerAd, BannerAdSize, TestIds} from '@react-native-firebase/admob';
import MusicVerItemrenderer from "../item-render/MusicVerItemrenderer"

const {width, height} = Dimensions.get('window');

const SortHeight = 50;
import Def from '../../../Def/Def'
import Style from "../../../Def/Style";


const PROGRAM_IMAGE_WIDTH = (width - 30-8) /2
const PROGRAM_IMAGE_HEIGHT = (width - 30-8) /2

const SortModal = (props) => (

    <Modal  visible={props.visible} transparent={true}>
        <TouchableOpacity onRequestClose={()=> {props.closeFunction(props.sortType)}} style={styles.modalView} onPress={()=> {props.closeFunction(props.sortType)}} activeOpacity={1}>

            <View  style={{right : 18, top:200,width : 100, height :100, backgroundColor:'#fff', alignItems: "center",
                alignSelf:'flex-end'}}>
                <TouchableOpacity style={styles.sortItem}>
                    <Text style={[styles.infoText,{color: props.sortType == 1? Style.DEFAUT_RED_COLOR : '#b3b3b3'}]} onPress={()=> {
                        props.closeFunction(1);
                    }}>
                        Mới nhất
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sortItem} onPress={()=> {
                    props.closeFunction(2);
                }}>
                    <Text style={[styles.infoText,{color: props.sortType == 2? Style.DEFAUT_RED_COLOR : '#b3b3b3'}]}>
                       Nghe nhiều
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sortItem} onPress={()=> {
                                props.closeFunction(3);
                            }}>
                                <Text style={[styles.infoText,{color: props.sortType == 3? Style.DEFAUT_RED_COLOR : '#b3b3b3'}]}>
                                    Ngẫu nhiên
                                </Text>
                            </TouchableOpacity>
            </View>
        </TouchableOpacity>
    </Modal>
    );



class MusicChanelScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {modalVisible:false, sortType:1,data:this.props.route.params.data};

        this.setModalVisible = this.setModalVisible.bind(this);
        this.closeFunction = this.closeFunction.bind(this);

        this.itemClick = this.itemClick.bind(this);
    }

    itemClick(item,all_data){
        //Def.global_player_stop();
        //Def.stopPlay();
        this.props.navigation.navigate('PlayMusic', {screen:'playMusic',params: {item:item,data:this.state.data}});

        //this.props.navigation.navigate(stack, {screen:screen, params: { item: item, data : this.props.route.params.data }});
    }


    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    };

    closeFunction =(sortType)=> {

        this.setState({modalVisible : false, sortType:sortType });
        if (sortType == 2)
            this.setState({ data: this.props.route.params.data.slice().sort(function(a,b) {return b.listens - a.listens}) });
        else if (sortType == 1)
            this.setState({ data: this.props.route.params.data });
        else if (sortType == 3)
            this.setState({ data: this.props.route.params.data.slice().sort(function() { return .5 - Math.random() })});
    };

    getAdsSize(){
        let widthh = Math.floor(width - 25);
        let heighth = 70;
        let rs = (widthh.toString()+ "x" + heighth.toString()).toString();
        return rs;

    }

    render() {
        const {navigation} = this.props;
        const renderItem = ({ item }) => (
            <MusicVerItemrenderer data={this.state.data} item={item} click={this.itemClick.bind(this,item)} />
        );
        return (
            <View style={styles.container}>
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
                <View style={styles.sortStyle}>
                    <TouchableOpacity style={{flexDirection:'row' , justifyContent:'space-between', alignItems:'center' , height:SortHeight}}
                        onPress={()=> {
                            this.setModalVisible(true);
                        }}
                    >
                        <Text style={{fontSize : 16, fontWeight: 'bold', color:'#808080', paddingHorizontal:10 }}>
                            Sắp xếp
                        </Text>
                        <SortIcon width={30} height={25}/>

                    </TouchableOpacity>

                </View>
                <SortModal visible={this.state.modalVisible} animationType="slide"  sortType={this.state.sortType} closeFunction={this.closeFunction}
                           transparent={true} />

                <View style={{marginTop : 20, marginBottom: 30}}>
                    <FlatList
                        data={this.state.data}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        showsHorizontalScrollIndicator={false}

                    />
                </View>

            </View>


        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex : 1,
      paddingLeft: 15,
      // justifyContent: 'flex-start',
      // marginVertical : 5,
      paddingVertical : 5,
      backgroundColor : '#fff',

    },
    slider: {
      justifyContent: 'center',
      paddingTop: 5,
      padding: 8,
      height: 100,
      borderRadius: 5,
      backgroundColor: "#e6e6e6",
      marginRight : 15
    },
    cardStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      width: width-20,
      height: width/2,

    },
    programListStyle : {

    },
    item: {
        backgroundColor: '#e6e6e6',
        width: (width - 30-8) / 2,
        height : (width - 30 -8 ) /2,
        borderRadius: 5,
        justifyContent : 'center',
        marginRight: 8,
        marginTop : 8,
    },
    itemImage: {
        width: PROGRAM_IMAGE_WIDTH -5,
        height : PROGRAM_IMAGE_HEIGHT -5,
        borderRadius: 5,
    },

    sortStyle : {
        height : 50,
        alignItems: 'flex-end',
        paddingRight : 15,
    },
    infoText : {
        fontSize : 13,
        color: '#b3b3b3'
    },
    ads : {
        // justifyContent: 'center',
        // height: 80,
        // borderRadius: 5,
        // backgroundColor: "#e6e6e6",
        // marginVertical : 5,
        height : 70,
        // alignItems: "center",
         marginRight : 5,
    },
    sortItem : {
        paddingVertical : 5,
        justifyContent : 'flex-end',
        alignItems : 'center'
    },
    modalView : {
        padding: 5,
        paddingVertical : 10,
        height :height,
        width : width,
        // marginTop:60,
        shadowOpacity:1,
        shadowRadius: 3.84,
        flex: 1,
        // backgroundColor : 'red'
    },

  });

export default MusicChanelScreen;
