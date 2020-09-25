import {PixelRatio} from 'react-native'


export default class Style{
    static HEADER_HEIGHT = PixelRatio.get() < 2? 36 :37;
    static TITLE_SIZE = PixelRatio.get() < 2 ? 15 :17;
    static MIDLE_SIZE = PixelRatio.get() < 2 ? 13 :14;
    static NORMAL_SIZE = PixelRatio.get() < 2 ? 11 :12;
    static SMALL_SIZE = PixelRatio.get() < 2 ? 10:11;
    static BIG_SIZE = PixelRatio.get() < 2 ? 17 :19;
    static DEFAUT_RED_COLOR = '#AD2428';
    static DEFAUT_BLUE_COLOR = '#305E74';

    static GREY_TEXT_COLOR = '#b3b3b3';
    static DEFAULT_BACKGROUN_COLOR = "#e6e6e6";
}
