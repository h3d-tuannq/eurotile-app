import React, {PureComponent} from 'react'
import {Text, View, Button, StyleSheet, Dimensions, Image, FlatList} from 'react-native'

import ProgramItemrenderer from "../item-render/ProgramItemrenderer"
import admob, { MaxAdContentRating ,BannerAd, BannerAdSize, TestIds} from '@react-native-firebase/admob';

const {width, height} = Dimensions.get('window');


const PROGRAM_IMAGE_WIDTH = (width - 30) /2
const PROGRAM_IMAGE_HEIGHT = (width - 30) /2

class ChanelScreen extends React.Component {
    constructor(props){
        super(props);
    }

    refresh()
    {
        console.log("================");
        console.log("TvScreen refresh");
        this.setState({ stateCount: Math.random() });
    }

    itemClick(item){
        this.props.navigation.navigate('PlayRadio', {screen:'commonPlayRadio', params: { item: item ,data:this.props.route.params.data}});

    }

    getAdsSize(){
        let widthh = Math.floor(width - 25);
        let heighth = 70;
        let rs = (widthh.toString()+ "x" + heighth.toString()).toString();
        return rs;

    }

    render() {
        const {navigation} = this.props;
        const renderItem = ({ item }) => (
            <ProgramItemrenderer   stack={'PlayRadio'}  screen={'commonPlayRadio'} click={() =>this.itemClick(item)} item={item} favorite={true} styleImage={{width:PROGRAM_IMAGE_WIDTH -2, height:PROGRAM_IMAGE_HEIGHT-5 }} />
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
                    <FlatList
                        style={{marginTop : 10}}
                        data={this.props.route.params.data}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        showsHorizontalScrollIndicator={false}
                        numColumns={2}

                    />
            </View>


        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex : 1,
      paddingLeft: 15,
      paddingBottom : 10,
      backgroundColor : '#fff',
      paddingTop : 10,

    },
    slider: {
      justifyContent: 'center',
      paddingTop: 5,
      padding: 8,
      height: 120,
      borderRadius: 5,
      backgroundColor: "#e6e6e6",
      marginRight : 15
    },
    ads : {
        height : 70,
        marginRight :5,
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
        // padding: 20,
        // marginVertical: 8,
        // marginHorizontal: 16,
    },
    itemImage: {
        width: PROGRAM_IMAGE_WIDTH -5,
        height : PROGRAM_IMAGE_HEIGHT -5,
        borderRadius: 5,
    },
  });

export default ChanelScreen;
