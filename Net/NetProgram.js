import Def from '../Def/Def';
import Net from './Net';
/*
 lấy/thêm/sửa/xóa danh sách radio/tivi/bài hát yêu thích của 1 cá nhân
*/
export default class NetPrograms{
 
    static listPrograms(callback,errCallback) { 
        Net.sendRequest(callback,errCallback,Def.URL_CATEGORY_PROGRAM ,Def.GET_METHOD );
      }
     
      static listFavoritePrograms(callback,errCallback) { 
        Net.sendRequest(callback,errCallback,Def.URL_LOVE_PROGRAM ,Def.GET_METHOD );
      }
      
      static listFeaturePrograms(callback,errCallback,amount=2,offset=0) { 
        Net.sendRequest(callback,errCallback,`${Def.URL_FEATURE_PROGRAM}?amount=${amount}&offset=${offset}` ,Def.GET_METHOD );
      }
     
    
      static addFavoritePrograms(callback,errCallback,id) { 
        postParams = {
          "id":id 
        }
        Net.sendRequest(callback,errCallback,Def.URL_LOVE_PROGRAM ,Def.POST_METHOD,postParams );
      } 

      static deleteFavoritePrograms(callback,errCallback,id) { 
        Net.sendRequest(callback,errCallback,`${Def.URL_LOVE_PROGRAM}/${id}` ,Def.DELETE_METHOD );
      }
     
     
          
}

