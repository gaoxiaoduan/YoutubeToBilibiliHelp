import YTDlpWrap from "yt-dlp-wrap";
import { PROXY } from "../constant";
import { logger } from "./logger";

let ytdl: YTDlpWrap;
export const getYTDL = () => {
    if (!ytdl) {
        // @ts-ignore
        ytdl = new YTDlpWrap.default();
        return ytdl;
    }
    return ytdl;
};

export const getPlaylistEnd = (userURL: string): Promise<string> => {
    const ytdl = getYTDL();
    return new Promise((resolve, reject) => {
        // 跳过下载，只获取最新一条的视频信息
        const command = [`${userURL}`, "--proxy", `"${PROXY}"`, "--skip-download", "--print-json", "--playlist-end", "1"];
        const ytdlChannel = ytdl.exec(command, {shell: true});

        ytdlChannel
            .on("error", (e: Error) => {
                reject("");
                logger.error(`getPlaylistEnd错误\n`, e);
            });


        let lastVideoInfo = "";
        ytdlChannel.ytDlpProcess?.stdout.on("data", (data) => {
            lastVideoInfo += data;
        });

        ytdlChannel.ytDlpProcess?.stdout.on("end", () => {
            if (lastVideoInfo === "") reject("");
            resolve(lastVideoInfo);
        });
    });
};