import * as React from 'react';
import { Button, View, StyleSheet,Text,ScrollView,Dimensions } from 'react-native';
import Video from 'react-native-video'; 
import analytics from '@react-native-firebase/analytics';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default class VOVController extends React.Component  {
    // Initialize State
  state = {
    paused: false,
    index: 0,
    urls : [
      'http://media.kythuatvov.vn:1936/live/VTC3.HD/playlist.m3u8',
      'http://media.kythuatvov.vn:1935/live/VOVTV.sdp/playlist.m3u8',
      'http://media.kythuatvov.vn:1936/live/VOVTV.SDMPEG4PAL/playlist.m3u8',

      'http://media.kythuatvov.vn:1936/live/VOV1.sdp/playlist.m3u8', 
      "http://117.6.93.250:8009",
      "https://5a6872aace0ce.streamlock.net/nghevov2/vov2.stream_aac/playlist.m3u8",
      "https://5a6872aace0ce.streamlock.net/nghevov3/vov3.stream_aac/playlist.m3u8",
      "http://media.kythuatvov.vn:1936/live/VOV4_MT.sdp/playlist.m3u8",
      "https://5a6872aace0ce.streamlock.net/nghevov5/vov5.stream_aac/playlist.m3u8"
    ]
  }

  pauseVideo = () => {
    if(this.player ) {
      this.setState({ paused: true });
    }
    console.log("pauseVideo");
    analytics().logEvent('video', {
      action: "pause"
    })
    
  }

  playVideo = () => {
    if(this.player ) {
      this.setState({ paused: false });
    }

    console.log("playVideo");
    
    analytics().logEvent('video', {
      action: "play"
    })

    analytics().logEvent('basket', {
      id: 3745092,
      item: 'mens grey t-shirt',
      description: ['round neck', 'long sleeved'],
      size: 'L',
    })
    
  }

  next=()=>{
    this.setState({ paused: false });
    this.setState({ index: (this.state.index+1 + this.state.urls.length) % this.state.urls.length});
  }

  prev=()=>{
    this.setState({ paused: false });
    this.setState({ index: (this.state.index-1 + this.state.urls.length) % this.state.urls.length});
 
  }

   render(){
    //analytics().setCurrentScreen('VOV_TV'); 

    return (
      <View  style={styles.layout_c} >
                <View style={{   flex:1,backgroundColor: 'powderblue'}} >

                              <Video 
                                    ref={ref => {this.player  = ref}}
                                    resizeMode={"contain"}
                                    style={{
                                      aspectRatio: width/height, 
                                      width: "100%",
                                      borderWidth: 1
                                    }}
                                    //controls={true}
                                    paused={this.state.paused}
                                    source={{ uri:this.state.urls[this.state.index]}} //this.props.url
                                    shouldPlay
                                    useNativeControls  
                              />
                </View>

                <View style={{ flex:1, height: 50, backgroundColor: 'powderblue'}} >
                  <Text>{this.state.urls[this.state.index]}</Text> 
                </View>

                <View  style={styles.layout_r} >
                  <View style={{  flex: 1,height: 50}}>
                    <Button
                      style={{ height: 50  }}
                      onPress={ this.prev.bind(this)}  
                      title="Prev"
                      color="powderblue"
                      
                    />
                  </View>
                  <View style={{  flex: 1,height: 50}}>
                    <Button
                      style={{ height: 50  }}
                      onPress={this.state.paused ? this.playVideo.bind(this) : this.pauseVideo.bind(this) }  
                      title={this.state.paused  ? "START" : "STOP"}
                      color="powderblue"
                      
                    />
                  </View>
                  <View style={{  flex: 1,height: 50}}>
                    <Button
                      style={{ height: 50  }}
                      onPress={ this.next.bind(this)}  
                      title="NEXT"
                      color="powderblue"
                      
                    />
                  </View>

                </View>

              
 
      </View>
    );
   }


}
 // Later on in your styles..
var styles = StyleSheet.create({
 
  layout_c:{
    flex: 3,
    flexDirection: 'column',  
  },
  layout_r:{
    flex: 3, 
    flexDirection: 'row'
  }
});