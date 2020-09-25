import React from 'react'
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native'

import  ProgramVerItemrenderer from '../item-render/ProgramVerItemrenderer'
import IconArrow from "../../../assets/icon/icon_arrow.svg";
import Style from "../../../Def/Style";
import Def from "../../../Def/Def";



class ProgramVerList extends React.Component{
    constructor(props){
        super(props);
        this.sectionClick= this.sectionClick.bind(this);
        this.itemClick = this.itemClick.bind(this);
    }

    sectionClick(){
       console.log('section click');
        // this.props.navigation.navigate(this.props.group,{name: this.props.name});
    }

    itemClick(item){
        console.log("itemClick(item))))))))))))))))))))))))))))))))))))))))))))))))");

        let stack = this.props.stack ? this.props.stack :false;
        let screen = this.props.screen ? this.props.screen :'player';
        // Def.setItemMusic(item);

        item.program_name = item.name;
        Def.setItemProgram(item);
        if(stack){
            console.log("itemClick(item)STACKKKKKKKKKKKKKKKKKKKK");
            ////console.log(item);
            //console.log(this.props.data);
            console.log(`${stack}, {screen:${screen}, params: { item: ${item}, data : this.props.data }`);
            this.props.navigation.navigate(stack, {screen:screen, params: { item: item, data : this.props.data }});
        } else {
            console.log("itemClick(item)NOT STACKKKKKKKKKKKKKKKKKKKK");
            console.log(`this.props.navigation.navigate(${screen}, { item: item, data : this.props.data })`);
            this.props.navigation.navigate(screen, { item: item, data : this.props.data });
        }





    }



    render() {
        const {iconStyleHome, titleStyle,titleView, } = styles;
        const renderItem = ({item}) => {
            return (
                <View style={{paddingLeft : 15}}>
                    <ProgramVerItemrenderer item ={item} click={this.itemClick}/>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <FlatList

                    style={[styles.programList, { marginBottom :  0, backgroundColor:'#fff'}]}
                    data={this.props.data ? this.props.data : [] }
                    renderItem={renderItem}
                    keyExtractor={(item,index) => item.id + "" + index.toString()}
                    showsHorizontalScrollIndicator={false}
                    ListHeaderComponent={this.props.header}
                    ListFooterComponent={this.props.footer ? this.props.footer : null}
                    showsVerticalScrollIndicator ={false}
                     onEndReached={() => {this.props.endListReach ? this.props.endListReach() : console.log('list ended');}}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create ({
    container: {
        marginTop : 5,
        backgroundColor : '#fff'
    },
    titleStyle: {
        fontSize: Style.TITLE_SIZE,
        color: Style.DEFAUT_RED_COLOR,
        fontWeight: 'bold',
        marginRight : 10
    },
    titleView: {
        paddingVertical : 10,
        flexDirection : 'row',
        alignItems: 'center'
    }
    ,
    iconStyleHome: {
        width: 15, height: 15
    },
    programList: {
        marginBottom : 120,

    }
})

export default ProgramVerList;
