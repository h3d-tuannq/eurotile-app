import Def from '../Def/Def'; 
/*
  Phục vụ mục đích đăng nhập, đăng ký
*/
export default class Net{
 
  // jsonData là string json đã được stringify
  static sendRequest(callback,errCallback,url,method,dataObject = null)
  {
    console.log(`SENDING: ${JSON.stringify(dataObject)}`);
    console.log(`TO: ${url}`);
    console.log(`METHOD: ${method}`); 
    console.log(`{ 'Authorization': ${Def.login_token} }`)

    if(method == Def.GET_METHOD)
    {
        fetch(url, {
          method: method,
          headers: {
            'Authorization': Def.login_token, 
            'content-type':'application/json; charset=utf-8'
          }
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
        .catch((error) => { errCallback(error);}) ;
    }
    else if(method == Def.POST_METHOD )
    {
      
      let formData = new FormData();
      for (var property in dataObject) {
        formData.append(property, dataObject[property]); 
      }  
      fetch(url, {
        method: method,
        headers: {
          'Authorization': Def.login_token
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
      .catch((error) => { errCallback(error);}) ;
    }
    else if(method == Def.DELETE_METHOD )
    {
      fetch(url, {
        method: method,
        headers: {
       
          'Authorization': Def.login_token
        }
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
      .catch((error) => { errCallback(error);}) ;
    }
  }

}

