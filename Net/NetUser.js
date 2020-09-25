import Def from '../Def/Def';
import Net from './Net';
/*
  Phục vụ mục đích đăng nhập, đăng ký
*/
export default class NetUser{

  static signIn(callback,errCallback,firebaseJWT) {
    postParams =  {'jwtToken':firebaseJWT};
    Net.sendRequest(callback,errCallback,Def.URL_LOGIN ,Def.POST_METHOD,postParams);
  }

  static setNotification(callback,errCallback) {
    postParams =  {
                    'firebase_token':Def.notification_token,
                    'email':Def.email,
                    'os':Def.os
                  };
    Net.sendRequest(callback,errCallback,Def.URL_NOTIFICATION ,Def.POST_METHOD,postParams);
  }

  
  static listNotification(callback,errCallback) {
    Net.sendRequest(callback,errCallback,Def.URL_LIST_NOTIFICATION ,Def.GET_METHOD);
  }
   
}

