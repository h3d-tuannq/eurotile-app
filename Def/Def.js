
export default class Def{
    static URL_BASE = "http://vovadmin.duchungtech.com/api";
    static URL_CONTENT_BASE = "http://vovadmin.duchungtech.com";

    // token nhận được sau khi đăng nhập để gửi lên server lấy token user
    static firebase_token = '';
    // token để nhận notification
    static notification_token = '';
    // token để thao tác với api vov
    static login_token = '';//'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6IjRmMWcyM2ExMmFhIn0.eyJpc3MiOiJWT1YiLCJhdWQiOiJodHRwOlwvXC92b3YubG9jYWwiLCJqdGkiOiI0ZjFnMjNhMTJhYSIsImlhdCI6MTU5NjM0NjM4OSwiZXhwIjoxNjEyMTE0Mzg5LCJ1aWQiOjN9.ay2l1884Oz762GhmTgGXgSe25Pd5x8KykkPTBnd9JHI';
    static email = '';

    static os = 'android';
    static channels_data_radio = null;
    static channels_data_tv = null;
    static program_data = null;
    static channels_data_fav = null;
    static music_data_fav = null;
    static program_data_fav = null;
    static music_data = null;
    static news_data = null;
    static config_news_menu = null;

    static love_radio_channel_arr_callback = [];
    static love_tv_channel_arr_item = [];
    static love_music_channel_arr_item = [];

    static refresh_channel_homepage = null;

    static global_player_stop = null;
    static global_player_start = null;
    static global_player_is_stop = false;
    static global_player_schedule = null;

    static startPlay = null;
    static stopPlay = null;

    static startPlay_radio = null;
    static stopPlay_radio = null;

    static startPlay_music = null;
    static stopPlay_music = null;

    static setItemRadio = null;
    static setItemMusic = null;
    static setItemProgram = null;
    static setItemNews = null;

    static setProgress = null;

    static mainNavigate = null;

    static lastNameMini = null;
    static lastNameSmallMini = null;
    static lastType = null;
    static lastItem = null;
    static lastItemArr = null;

    static onPrevRadio                     = null;
    static onNextRadio                     = null;

    static onPrevMusic                      = null;
    static onNextMusic                     = null;

    static schedule = "";
    static timestampSchedule = "";

    // Dùng cho firebase
    static TAB_PERSONAL ='TAB_PERSONAL';
    static TAB_RADIO    ='TAB_RADIO';
    static TAB_TV       ='TAB_TV';
    static TAB_MUSIC    ='TAB_MUSIC';
    static TAB_NEWS     ='TAB_NEWS';

    static DETAIL_TV     ='DETAIL_TV';
    static DETAIL_MUSIC     ='DETAIL_MUSIC';
    static DETAIL_RADIO     ='DETAIL_RADIO';
    static DETAIL_WEB     ='DETAIL_NEWS';

    static SCREEN_ALARM     ='APP_ALARM';
    static SCREEN_TERM     ='APP_TERM';
    static SCREEN_PRIVACY     ='APP_PRIVACY';
    static SCREEN_APP_DRAWER     ='APP_DRAWER';
    static SCREEN_NOTIFICATON     ='APP_NOTIFICATON';

    static URL_NOTIFICATION                 = `${Def.URL_BASE}/notification/register`;
    static URL_LIST_NOTIFICATION            = `${Def.URL_BASE}/notification`;
    static URL_CAPTCHAR                     = `${Def.URL_BASE}/user/captcha`;
    //URL đăng nhập
    static URL_LOGIN                        = `${Def.URL_BASE}/user/firebase-login`;
    //URL đăng ký
    static URL_REGISTER                     = `${Def.URL_BASE}/user/register`;

    static URL_FEEDBACK                     = `${Def.URL_BASE}/feedbacks`
    //url lấy danh sách slide trang cá nhân
    static URL_SLIDE                        = `${Def.URL_BASE}/user/slide`;
    // url lấy danh sách quảng cáo
    static URL_ADS                          = `${Def.URL_BASE}/user/ads`;

    //url lấy/thêm/sửa/xóa danh sách radio/tivi/bài hát yêu thích của 1 cá nhân
    static URL_LOVE                         = `${Def.URL_BASE}/channels/favorites`;
    static URL_LOVE_MUSIC                   = `${Def.URL_BASE}/musics/favorites`;
    static URL_LOVE_PROGRAM                 = `${Def.URL_BASE}/daily-contents/favorites`;
    static URL_FEATURE_PROGRAM                 = `${Def.URL_BASE}/daily-contents/featured`;
    static URL_MUSIC_COMMENT                   = `${Def.URL_BASE}/musics`; ///1/comments?amount=20&offset=0

    // url lấy danh sách kênh radio/TV/ca nhạc/tin tức theo category
    static URL_CATEGORY                     = `${Def.URL_BASE}/channels`;
    static URL_CATEGORY_MUSIC               = `${Def.URL_BASE}/musics`;
    static URL_CATEGORY_NEWS                = `${Def.URL_BASE}/reader`;
    static URL_CATEGORY_PROGRAM             = `${Def.URL_BASE}/programs`;
    static URL_SLIDE                        = `${Def.URL_BASE}/carousels`;// /1
    //static URL_CATEGORY_NEWS              = 'http://api.com/category_news';    // chưa cần

    static URL_RUNNING_TEXT                 = `${Def.URL_BASE}/channels`;

    static URL_DAILY_CONTENT_COMMENT                 = `${Def.URL_BASE}/daily-contents`;//1/comments
    static URL_COUNT                 = `${Def.URL_CONTENT_BASE}/statistic/channel`;///1/1234

    static URL_BROADCAST                    = `${Def.URL_BASE}/channels/broadcast-schedules`;//1?from=24-07-2020&to=28-07-2020

    // Select
    static GET_METHOD                       = "GET";
    // Insert
    static POST_METHOD                      = "POST";
    //Delete
    static DELETE_METHOD                    = "DELETE";
    //Update
    static PUT_METHOD                       = "PUT";

    static TOAST_DURATION                   = 3000; // 3 seconds
    static TOAST_ERROR_COLOR                = 'orange';
    static TOAST_SUCCESS_COLOR              = 'blue';


    static ERROR_EMAIL_MISSING                  = 'Vui lòng cung cấp email';
    static ERROR_PASSWORD_MISSING               = 'Vui lòng cung cấp pasword';
    static ERROR_PASSWORD_NOT_MATCH             = 'Password không giống nhau';

    static ERROR_LOGIN_MISSING                  = 'Vui lòng đăng nhập trước khi thực hiện hành động này';
    static ERROR_LOADING_DATA                   = 'Đang tải dữ liệu, vui lòng chờ';
    static ALERT_DISABLE_SELECTION              = "Lựa chọn này đã bị khóa, vui lòng chọn mục khác";

    static WEB_CLIENT_ID = '362818592929-d97hfbqln6qqc23qfvre2f1m4be6qimb.apps.googleusercontent.com';

    static TYPE_RADIO      = 1;
    static TYPE_MUSIC      = 2;
    static TYPE_PROGRAM    = 3;
    static TYPE_NEWS       = 4;
    static TYPE_DAILYCONTENT       = 5;

    static getDateString(date, format) {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        getPaddedComp = function(comp) {
            return ((parseInt(comp) < 10) ? ('0' + comp) : comp)
        },
        formattedDate = format,
        o = {
            "y+": date.getFullYear(), // year
            "M+": getPaddedComp(date.getMonth()+1), //month
            "d+": getPaddedComp(date.getDate()), //day
            "h+": getPaddedComp((date.getHours() > 12) ? date.getHours() % 12 : date.getHours()), //hour
             "H+": getPaddedComp(date.getHours()), //hour
            "m+": getPaddedComp(date.getMinutes()), //minute
            "s+": getPaddedComp(date.getSeconds()), //second
            "S+": getPaddedComp(date.getMilliseconds()), //millisecond,
            "b+": (date.getHours() >= 12) ? 'PM' : 'AM'
        };

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                formattedDate = formattedDate.replace(RegExp.$1, o[k]);
            }
        }
        return formattedDate;
    };


}
