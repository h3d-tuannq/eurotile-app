import Def from '../Def/Def';
import Net from './Net';

/*
  lấy/ thêm danh sách radio/TV/ca nhạc/tin tức đặc sắc 
*/
export default class NetNews{
  static listNews(callback,errCallback) { 
    Net.sendRequest(callback,errCallback,Def.URL_CATEGORY_NEWS ,Def.GET_METHOD );
  }
}
