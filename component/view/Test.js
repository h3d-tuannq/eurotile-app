import React from 'react';
import { View, KeyboardAvoidingView, TextInput, StyleSheet, Text, Platform, TouchableWithoutFeedback, Button, Keyboard  } from 'react-native';
import CommentComponent from "./common/CommentComponent";

import RatingComponent from './common/RatingComponent'
import InteractAnswerComponent from './common/InteractAnswerComponent'

const KeyboardAvoidingComponent = (props) => {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.inner1}>
                    <Text style={styles.header}>Header</Text>

                    <View style={{height:50}}>
                    <Text>
                        abcd
                    </Text>
                </View>
                    <View>
                        <RatingComponent />
                        <InteractAnswerComponent />
                    </View>



                    <View style={{}} >
                        <CommentComponent id={props.route.params.id} style={{height:300}} />
                    </View>

                    <TextInput placeholder="Username" style={styles.textInput} />
                    <View style={styles.btnContainer}>
                        <Button title="Submit" onPress={() => null} />
                    </View>


                </View>


            </TouchableWithoutFeedback>


        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    inner1: {
        padding: 24,
        flex: 1,
        justifyContent: "space-around"
    },
    header: {
        fontSize: 36,
        marginBottom: 48
    },
    textInput: {
        marginTop : 20,
        height: 40,
        borderColor: "#000000",
        borderBottomWidth: 1,
        marginBottom: 36
    },
    btnContainer: {
        backgroundColor: "white",
        marginTop: 12
    }
});

export default KeyboardAvoidingComponent;
