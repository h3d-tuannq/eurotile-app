import Def from '../Def/Def';
import Net from './Net';
import { SliderComponent } from 'react-native';
 
//lấy danh sách kênh radio/TV/ca nhạc/tin tức theo category
import RNFetchBlob from 'rn-fetch-blob';
export default class NetFeedback{

    static sendFeedBack(callback,errCallback,title,content,phone,email,record_path = null) {
 

        voiceFile = {
            file: {
                uri: record_path, 
                type: 'video/mp4',
                name: 'voiceFile',
            }
          }


        let formData = new FormData();
        for (var property in postParams) {
            formData.append(property, postParams[property]); 
        } 

       
        if(record_path){  
            //Def.global_player_start(record_path);
            formData.append('voiceFile', { 
                uri: Platform.OS === "android" ? record_path : record_path.replace("file://", ""),
                type: 'video/mp4',
                name: 'sound.mp4',
            }); 
            
/*
            for (let key  in voiceFile) formData.append(key, voiceFile[key]); */
      }
      

        console.log(`SENDING: ${JSON.stringify(formData)}`);
        console.log(`TO: ${Def.URL_FEEDBACK}`);
        console.log(`METHOD: POST_METHOD`); 
        console.log(`record_path: ${record_path}`); 
        console.log(`{ 'header': ${JSON.stringify({
            'Accept': 'application/json',
            'Authorization': Def.login_token,
            "Host":"vovadmin.duchungtech.com"
            })} }`);
        
    RNFetchBlob.fetch('POST',Def.URL_FEEDBACK, {
        'content-type': 'multipart/form-data' 
        },[ 
            {name: 'voiceFile', filename: 'sound.mp4', data: RNFetchBlob.wrap(record_path) },
            {name: 'title', data: title }, 
            {name: 'content', data: content }, 
            {name: 'phone', data: phone }, 
            {name: 'email', data: email } 
             
        ]).then(response => response.text())
        .then(response => {callback(JSON.stringify(response))})
        .catch((err) => {
            errCallback(JSON.stringify(err))
        });
        /*
        fetch(Def.URL_FEEDBACK, {
            method: Def.POST_METHOD,
            headers: {
            'Accept': 'application/json',
            'Authorization': Def.login_token,
            "Host":"vovadmin.duchungtech.com"
            },
            body: formData
        })
        .then(response => response.text())
        .then(text => {
            try {
                let data = JSON.parse(text);
                callback(data)
            } catch(err) {
            errCallback(err + ': ' + url);
            }
        })
        .catch((error) => { errCallback(JSON.stringify(error));}) ; 
        */
      }
       

}

