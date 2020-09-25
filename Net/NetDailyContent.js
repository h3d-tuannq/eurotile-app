import Def from '../Def/Def';
import Net from './Net';

//lấy danh sách kênh radio/TV/ca nhạc/tin tức theo category

export default class NetDailyContent{

    static sendComment(callback,errCallback,id_daily_content,comment) {
        postParams = {
            "content":comment
        }
        Net.sendRequest(callback,errCallback,`${Def.URL_DAILY_CONTENT_COMMENT}/${id_daily_content}/comments` ,Def.POST_METHOD,postParams);
    }

    static getComments(callback,errCallback,id_daily_content) {
        Net.sendRequest(callback,errCallback,`${Def.URL_DAILY_CONTENT_COMMENT}/${id_daily_content}/comments` ,Def.GET_METHOD);
    }

    static getContent(callback,errCallback,id_daily_content) {
        Net.sendRequest(callback,errCallback,`${Def.URL_DAILY_CONTENT_COMMENT}/${id_daily_content}` ,Def.GET_METHOD);
    }

    static getInteact(callback,errCallback,id_channel) {
        Net.sendRequest(callback,errCallback,`${Def.URL_CATEGORY}/${id_channel}/interactive-contents` ,Def.GET_METHOD);
    }
       
    static sendInteact(callback,errCallback,id_channel,id_ans) {
        postParams = {
            "option_id":id_ans
        }
        Net.sendRequest(callback,errCallback,`${Def.URL_CATEGORY}/${id_channel}/interactive-contents`  ,Def.POST_METHOD,postParams);
    }

    static getRating(callback,errCallback,id_daily_content) {
        /*callback(
                    {
                        "data":{
                            "rating": 4.3,
                            "rating_count": 158
                        }
                    }
                );
                    */
        Net.sendRequest(callback,errCallback,`${Def.URL_DAILY_CONTENT_COMMENT}/${id_daily_content}/ratings` ,Def.GET_METHOD);
    }
       
    static sendRating(callback,errCallback,id_daily_content,rating) {
        postParams = {
            "rating":parseInt(rating)
        }
        Net.sendRequest(callback,errCallback,`${Def.URL_DAILY_CONTENT_COMMENT}/${id_daily_content}/ratings`  ,Def.POST_METHOD,postParams);
    }
       

}

