import Def from '../Def/Def';
import Net from './Net';

//lấy danh sách kênh radio/TV/ca nhạc/tin tức theo category

export default class NetChannel{

  static listChannel(callback,errCallback) { 
    Net.sendRequest(callback,errCallback,Def.URL_CATEGORY ,Def.GET_METHOD );
  }

  static getChannelById(callback,errCallback,id) { 
    Net.sendRequest(callback,errCallback,`${Def.URL_CATEGORY}/${id}` ,Def.GET_METHOD ); 
  }
 
  static listFavorite(callback,errCallback) { 
    Net.sendRequest(callback,errCallback,Def.URL_LOVE ,Def.GET_METHOD );
  }

  static addFavorite(callback,errCallback,id) { 
    postParams = {
      "id":id 
    }
    Net.sendRequest(callback,errCallback,Def.URL_LOVE ,Def.POST_METHOD,postParams );
  }

  static deleteFavorite(callback,errCallback,id) { 
    Net.sendRequest(callback,errCallback,`${Def.URL_LOVE}/${id}` ,Def.DELETE_METHOD );
  }

  //1?from=24-07-2020&to=28-07-2020
  static listBroadcast(callback,errCallback,id,from,to) { 
    Net.sendRequest(callback,errCallback,`${Def.URL_BROADCAST}/${id}?from=${from}&to=${to}` ,Def.GET_METHOD); 
  }

  static coundCCU(callback,errCallback,id) { 
    Net.sendRequest(callback,errCallback,`${Def.URL_COUNT}/${id}/${Def.notification_token}` ,Def.GET_METHOD); 
  }

  static runningText(callback,errCallback,channel_id) {  
    Net.sendRequest(callback,errCallback,`${Def.URL_RUNNING_TEXT}/${channel_id}/running-text` ,Def.GET_METHOD); 
    return;
    

      fetch("https://www.dongabank.com.vn/exchange/export", {
        method: Def.GET_METHOD,
        headers: { 
          'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
        }
      })
      .then(response => response.text())
      .then(text => {
        
        try { 
            let data = JSON.parse(text.replace('(','').replace(')',''));
            callback(data)
        } catch(err) {
          errCallback(err );
        }
      })
      .catch((error) => { errCallback(error);}) ;
  }

  //

}

