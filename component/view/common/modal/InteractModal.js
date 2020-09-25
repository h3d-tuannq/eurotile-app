import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView} from 'react-native'
import DownIconSvg from '../../../../assets/icon/icon-down-black.svg'

import CommentComponent from '../../common/CommentComponent'
import Style from "../../../../Def/Style";
const {width, height} = Dimensions.get('window');

const headerHeight = width / 2;

class InteractModal extends React.Component{

    constructor(props){
        super(props);
        console.log("class InteractModal extends React.Component");
        console.log(this.props);
    }
    render() {
        return (
            <View style={{flex:1, backgroundColor:'#fff'}}>
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
                            Bình luận
                        </Text>
                    </View>



                </View>

                <View style={{marginTop : 10, flex:1}} >
                    <CommentComponent  hiddenTitle={1}  listHeight={height -50} name={this.props.route.name} dependKeyboard={false} openHeight={height*0.5} id={this.props.route.params.item.id}/>
                </View>
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
    title:{
        fontSize: Style.TITLE_SIZE,
        color: Style.DEFAUT_RED_COLOR,
        fontWeight: 'bold',
        marginLeft: 20,
    },

    titleGroup : {
        justifyContent : 'center'
    },

});

export default InteractModal;
