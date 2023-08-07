import { logger } from "./logger";
import { getYTDL } from "./getYTDL";
import { getCurrentTime } from "./getCurrentTime";
import { PROXY } from "../constant";

const ytdl = getYTDL();

export const getCustomTimeList = (custom_time_channel: upload_log_type.customTimeChannel): Promise<any[]> => {
    const currentTime = getCurrentTime("yyyyMMdd");
    const {user_url, date_after, date_before} = custom_time_channel;
    return new Promise((resolve, reject) => {
        // 跳过下载，获取指定日期内的视频信息
        const command = [`${user_url}`, "--proxy", `${PROXY || ("\"\"")}`, "--dateafter", `${date_after || currentTime}`, "--datebefore", `${date_before || currentTime}`, "--skip-download", "--print-json"];

        logger.info("command", command.join(" "));

        logger.info("开始获取指定日期范围的视频");
        logger.info("若用户的视频较多,需要挨个查看,失败请重试～请耐心等待...");

        const ytdlChannel = ytdl.exec(command, {shell: true});

        ytdlChannel
            .on("error", (e: Error) => {
                reject("");
                logger.error(`getCustomTimeList错误\n`, e);
            });


        let findVideoInfo = "";
        ytdlChannel.ytDlpProcess?.stdout.on("data", (data) => {
            findVideoInfo += data;
        });

        ytdlChannel.ytDlpProcess?.stdout.on("end", () => {
            if (findVideoInfo === "") reject([]);
            let videoInfoList = findVideoInfo.split("\n")
                .map(item => {
                    if (item === "") return;
                    return JSON.parse(item);
                })
                .filter(Boolean);
            logger.info(`获取指定日期范围的视频成功,共${videoInfoList.length}条视频`);
            resolve(videoInfoList);
        });
    });
};