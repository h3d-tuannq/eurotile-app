import React, {PureComponent} from 'react'
import {Text, View, Button, StyleSheet, Dimensions, ScrollView, FlatList} from 'react-native'
import ProgramItemrenderer from '../item-render/ProgramItemrenderer'

const {width, height} = Dimensions.get('window');


const PROGRAM_IMAGE_WIDTH = (width - 30) /2
const PROGRAM_IMAGE_HEIGHT = (width - 30) /2

const renderItem = ({ item }) => (
    <ProgramItemrenderer item={item} favorite={true} styleImage={{width:PROGRAM_IMAGE_WIDTH -2, height:PROGRAM_IMAGE_HEIGHT-5 }} />
);
const data = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'First Item',
        imagePath: '',
        isFavorite: true
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
        imagePath: '',
        isFavorite: false
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
        imagePath: '',
        isFavorite: true
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72f',
        title: 'Fouth Item',
        imagePath: '',
        isFavorite: false
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72d',
        title: 'Fifth Item',
        imagePath: '',
        isFavorite: true,
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
        imagePath: '',
        isFavorite: false
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d724',
        title: 'Third Item',
        imagePath: '',
        isFavorite: true
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f635',
        title: 'Second Item',
        imagePath: '',
        isFavorite: false
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d726',
        title: 'Third Item',
        imagePath: '',
        isFavorite: true
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d727',
        title: 'Third Item',
        imagePath: '',
        isFavorite: true
    },
];

class MyFavoriteScreen extends React.Component {
    constructor(props){
        super(props);
        // this.props.navigation.setOptions({ title:  this.props.route.params.name + ' yêu thích' });
    }
    render() {
        const {navigation} = this.props;

        return (
            <View style={styles.container}>
                <View  style={styles.slider} >
                </View>
                <View style={{marginTop : 20}}>
                    <FlatList

                        data={this.props.route.params.data}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        showsHorizontalScrollIndicator={false}
                        numColumns={2}

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
      paddingVertical : 5,
        backgroundColor: '#fff',
      // marginBottom : 125,
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

export default MyFavoriteScreen;
