import React from 'react'
import {Text, View, Button, StyleSheet, Dimensions, ScrollView, FlatList, Platform} from 'react-native'
import NewsVerItemrenderer from '../item-render/NewsVerItemrenderer'
import ScrollableTabView, { ScrollableTabBar }  from 'react-native-scrollable-tab-view';
import Style from "../../../Def/Style";

const {width, height} = Dimensions.get('window');


const PROGRAM_IMAGE_WIDTH = (width - 30-8) /4
const PROGRAM_IMAGE_HEIGHT = (width - 30-8) /4


class NewsTab extends React.Component {
    constructor(props){
        super(props);
        this.itemClick = this.itemClick.bind(this);
        // this.props.navigation.setOptions({ title:  'Tin tức' });
    }

    itemClick(item){
        console.log(item.id);
        this.props.navigation.navigate('newsDetail', { item:item});

    }

    render() {
        const {navigation} = this.props;
        const renderItem = ({ item }) => (
            <NewsVerItemrenderer item={item} click={this.itemClick} favorite={true} styleImage={{width:PROGRAM_IMAGE_WIDTH-5, height:PROGRAM_IMAGE_HEIGHT-5 }} />
        );
        return (
            <View style={styles.container}>
                <View style={{}}>
                    <FlatList
                        data={this.props.data}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        showsHorizontalScrollIndicator={false}
                        ItemSeparatorComponent={

                            (({ highlighted }) => (
                                <View
                                    style={[
                                        {backgroundColor:Style.GREY_TEXT_COLOR, height:1, width:width -25, marginRight: 10},
                                        highlighted && { marginRight: 10 }
                                    ]}
                                />
                            ))
                        }

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
        // marginBottom : 5,
        backgroundColor: '#fff',
        paddingTop : 5
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
    cardStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: width-20,
        height: width/2,

    },
    programListStyle : {

    },
    itemImage: {
        width: PROGRAM_IMAGE_WIDTH -5,
        height : PROGRAM_IMAGE_HEIGHT -5,
        borderRadius: 5,
    },
});

export default NewsTab;
