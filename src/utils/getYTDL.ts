import YTDlpWrap from "yt-dlp-wrap";

let ytdl: YTDlpWrap;
export const getYTDL = () => {
    if (!ytdl) {
        ytdl = new YTDlpWrap();
        return ytdl;
    }
    return ytdl;
};