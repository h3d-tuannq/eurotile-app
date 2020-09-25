import React, {Component} from 'react'
import {
    Text,
    Image,
    StyleSheet,
    View,
    TextInput,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    Modal,PixelRatio
} from 'react-native'
import FirebaseController from '../../../Controller/FirebaseController'
import Style from "../../../Def/Style";
import FacebookIcon from '../../../assets/icon/icon-facebook.svg'
import GoogleIcon from '../../../assets/icon/icon-google.svg'
import ZaloIcon from '../../../assets/icon/icon-zalo.svg'
import Def from '../../../Def/Def';

const {width,height} = Dimensions.get('window');

const LoadingModal = (props) => (
    <Modal onRequestClose={() => {console.log('test')}} visible={props.visible} transparent={true} styles={{backgroundColor : '#green'}} >
        <View style={{ justifyContent : 'center', alignItems:'center', flex: 1 }}>
            <ActivityIndicator size="large" color="#0c5890"/>
        </View>
    </Modal>
)

export default class SignIn extends Component {
    constructor(props){
        super(props);
        this.state = {
            focus : 0,
            email:"",
            password:"",
            isLoging : false,
        }
        this.signIn = this.signIn.bind(this);
        this.setLoader = this.setLoader.bind(this);
        Def.setLoader = this.setLoader;
    }

    setLoader(isLoging){
        this.setState({isLoging:isLoging});
    }

    signIn(){
        if(!this.state.email.includes("@", 0) && !this.state.email.includes(".", 0)){
            alert("Email không đúng định dạng");
        } else if(this.state.password.length < 6){
            alert("Mật khẩu phải dài hơn 8 ký tự");
        }else{
            const {navigation} = this.props;
            this.setState({isLoging:true});
            console.log('signIn');
            FirebaseController.emailLogin(this.state.email,this.state.password,navigation);
        }
    }


    render() {
        const {navigation} = this.props;
        const {wraper,loginform, loginButton, loginText , button, labelInputNormal ,
            labelInputHover, textInputHover, textInputNormal } = styles;

        return (
            <View style={wraper}>

                <View style={[loginform, {marginTop:-10}]}>
                    {/*<Text style={{fontSize:Style.BIG_SIZE, fontWeight: 'bold', color: '#000', marginBottom :20}}>*/}
                        {/*Đăng nhập*/}
                    {/*</Text>*/}

                    {/*<Text style={this.state.focus == 1 ? labelInputHover : labelInputNormal}>Email</Text>*/}
                    <TextInput
                        onFocus={() => this.setState({focus:1})}
                        onBlur={()=> this.setState({focus:0})}
                        style={this.state.focus == 1 ? textInputHover : textInputNormal}
                        value={this.state.email}
                        onChangeText={text => this.setState({email:text})}
                        placeholder='Nhập Email'
                        placeholderTextColor="#b3b3b3"
                        autoCapitalize = 'none'
                        // underlineColorAndroid = "transparent"
                    />
                    {/*<Text style={this.state.focus == 2 ? labelInputHover : labelInputNormal}>Password</Text>*/}
                    <TextInput
                        onFocus={() => this.setState({focus:2})}
                        onBlur={()=> this.setState({focus:0})}
                        style={this.state.focus == 2 ? textInputHover : textInputNormal}
                        value={this.state.password}
                        onChangeText={text => this.setState({password:text})}
                        secureTextEntry={true}
                        placeholder='Nhập mật khẩu'
                        placeholderTextColor="#b3b3b3"
                        autoCapitalize = 'none'
                        underlineColorAndroid = "transparent"
                    />

                    <View style={{flexDirection: 'row', justifyContent : 'flex-end', alignItems : 'center' , marginTop:10 }}>
                        <TouchableOpacity style={{alignItems: 'center', marginRight : 20}} onPress={()=> {
                            navigation.navigate('forgetPass');
                        }}>
                            <Text style={{fontSize:Style.MIDLE_SIZE, color:'#b3b3b3'}}>
                                Quên mật khẩu?
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={loginButton} onPress={()=>this.signIn()}>
                            <Text style={loginText}>
                                Đăng nhập
                            </Text>
                        </TouchableOpacity>

                    </View>
                    <LoadingModal visible={this.state.isLoging}/>

                    <TouchableOpacity style={{alignItems: 'center', marginTop : 20, paddingVertical: 5,marginRight : 20, flexDirection : 'row', maxWidth: width -20}} onPress={()=> {
                        navigation.navigate('signUp');
                    }}>
                        <Text style={{fontSize:Style.TITLE_SIZE, color:'#b3b3b3'}}>
                            Bạn chưa có tài khoản?
                        </Text>
                        <Text style={{fontSize:Style.MIDLE_SIZE, marginLeft:5 , color:Style.DEFAUT_RED_COLOR}}>
                            Đăng ký ngay
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[button, {backgroundColor:'#1976d2'}]}  onPress={()=>{
                        console.log('test');
                        this.setState({isLoging:true});

                         FirebaseController.facebookLogin(navigation)
                    }}>
                        <FacebookIcon style={styles.icon}

                        />
                        <Text style={styles.buttonText}>
                            Đăng nhập với Facebook
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[button, {backgroundColor:'#ffffff'}]} onPress={()=> {
                        this.setState({isLoging:true});
                        FirebaseController.googleLogin(navigation);

                    }}>
                        <GoogleIcon style={styles.icon}
                        />
                        <Text style={[styles.buttonText, {color: '#b3b3b3'}]}>
                            Đăng nhập với Google
                        </Text>
                    </TouchableOpacity>


                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wraper : {flex:1, alignItems: 'center' , backgroundColor: '#fff', justifyContent : 'center'},
    loginform : { width : width * 0.9, marginTop: height / 20,},
    textInputNormal : {height: 45, backgroundColor : '#fff', borderColor: "#9e9e9e", borderWidth : 1 ,color:'black', fontSize : Style.TITLE_SIZE, borderRadius: 5, marginTop: 10, paddingHorizontal: 10  },
    textInputHover : {height: 45, backgroundColor : '#fff', borderColor: "#48a5ea", borderWidth : 1 , color:'black', fontSize : Style.TITLE_SIZE,borderRadius: 5, marginTop: 10, paddingHorizontal: 10 },
    loginButton : { backgroundColor : '#ff3c29' ,borderRadius : 5, paddingLeft: 20, paddingRight : 10 },
    button : {
        paddingVertical : 5,backgroundColor : '#ff3c29' ,borderRadius : 5, paddingLeft: 20, marginTop : 20, borderWidth : 1, borderColor:'#b3b3b3',
        flexDirection : 'row', alignItems: 'center',
    },
    icon : {
        width :25,
        height : 25
    },

    loginText : { color:'#fff', fontSize : Style.TITLE_SIZE, textAlign : 'center', paddingVertical: 8},
    buttonText : { color:'#fff', fontSize : Style.TITLE_SIZE, paddingVertical: 8, marginLeft: 15},
    labelInputNormal : { color:'#9e9e9e', fontSize : Style.NORMAL_SIZE, marginTop : 20 },
    labelInputHover : { color:'#48a5ea', fontSize : Style.NORMAL_SIZE, marginTop : 20 },
    logoContainer : {alignItems : 'center', width :  width * 0.8, justifyContent: 'center', paddingBottom : 10 , marginTop: height / 10 },
    logoStyle : {width : width /5 , height : width /5 }
});
