import { error } from "./log";
import { getYTDL } from "./getYTDL";

const ytdl = getYTDL();
export const getPlaylistEnd = (userURL: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        // 跳过下载，只获取最新一条的视频信息
        const command = [`${userURL}`, "--skip-download", "--print-json", "--playlist-end", "1"];
        const ytdlChannel = ytdl.exec(command, {shell: true});

        ytdlChannel
            .on("error", (e: Error) => {
                reject("");
                error(`getPlaylistEnd错误\n`, e);
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