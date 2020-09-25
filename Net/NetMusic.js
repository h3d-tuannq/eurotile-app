import Def from '../Def/Def';
import Net from './Net';
/*
 lấy/thêm/sửa/xóa danh sách radio/tivi/bài hát yêu thích của 1 cá nhân
*/
export default class NetMusic{
 
    static listMusic(callback,errCallback) { 
        Net.sendRequest(callback,errCallback,Def.URL_CATEGORY_MUSIC ,Def.GET_METHOD );
      }
     
      static listFavoriteMusic(callback,errCallback) { 
        Net.sendRequest(callback,errCallback,Def.URL_LOVE_MUSIC ,Def.GET_METHOD );
      }
      static listMusicComment(callback,errCallback,id) { 
        Net.sendRequest(callback,errCallback,`${Def.URL_MUSIC_COMMENT}/${id}/comments?amount=2000&offset=0` ,Def.GET_METHOD );
      }

      static sendMusicComment(callback,errCallback,id,comment) {  
        postParams = {
          "content":comment 
        }
        Net.sendRequest(callback,errCallback,`${Def.URL_MUSIC_COMMENT}/${id}/comments` ,Def.POST_METHOD ,postParams );
      }

      
    
      static addFavoriteMusic(callback,errCallback,id) { 
        postParams = {
          "id":id 
        }
        Net.sendRequest(callback,errCallback,Def.URL_LOVE_MUSIC ,Def.POST_METHOD,postParams );
      } 

      static deleteFavoriteMusic(callback,errCallback,id) { 
        Net.sendRequest(callback,errCallback,`${Def.URL_LOVE_MUSIC}/${id}` ,Def.DELETE_METHOD );
      }
     
      static redirectMusic(callback,errCallback,url){ 
              console.log(`redirectMusic ${url}`);
              fetch(url, {
                method: Def.GET_METHOD
              })
              .then(response => {
                
                
                  callback(response.url);
               
              })
              .catch((error) => { errCallback(error);}) ;
      }

  }
     
     
