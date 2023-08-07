import YTDlpWrap from "yt-dlp-wrap";

let ytdl: YTDlpWrap;
export const getYTDL = () => {
    if (!ytdl) {
        // @ts-ignore
        ytdl = new YTDlpWrap.default();
        return ytdl;
    }
    return ytdl;
};