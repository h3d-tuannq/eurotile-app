import Def from '../Def/Def';
import Net from './Net';

//lấy danh sách slide trang cá nhân

export default class NetSlide{
 
    static getSlides(callback,errCallback,id=1) { 
        Net.sendRequest(callback,errCallback,`${Def.URL_SLIDE}/${id}` ,Def.GET_METHOD);
    }

    
    static getSlidesByChannel(callback,errCallback,id=1) { 
        Net.sendRequest(callback,errCallback,`${Def.URL_BASE}/channels/${id}/slides` ,Def.GET_METHOD); 
    }
}

