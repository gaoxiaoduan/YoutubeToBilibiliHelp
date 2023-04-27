import * as fs from "fs";
import path from "path";
import { delay, error, getCurrentTime, getPlaylistEnd, log, mkdir } from "./utils";
import { interval } from "./constant";
import * as upload_log from "upload_log.json";
import { translate } from "bing-translate-api";

type configType = typeof upload_log.default;

export interface IChangedInfo {
    user: string;
    user_url: string;
    publish_prefix?: string;
    blibli_classification?: number[];
    video_info: {
        id: string;
        video_url: string;
        title: string;
        uploader: string;
        upload_date: string;
        dirPath: string;
        filename: string;
        uploadTitle: string;
        tags: string[];
        published: string[];
    };
}

//  读配置文件
// 循环遍历，判断内容是否更新
//  更新-》写文件，返回更新的标识 -> 视频的id｜url
//      -》走发布的代码流程
//      -》更新已发布平台信息
//      -》继续轮训，与json信息做比较
//  未更新返回false
const checkChange = async () => {
    const configPath = path.resolve(__dirname, "../upload_log.json");
    const config = fs.readFileSync(configPath).toString();
    const configObj: configType = JSON.parse(config);

    for (const channelItem of configObj.uploads) {
        const firstVideoInfo = channelItem.videos[0];
        const playlistEndInfo = await getPlaylistEnd(channelItem.user_url);
        if (playlistEndInfo === "") return error(`最新视频信息获取失败：${channelItem.user_url}`);
        const playlistEndInfoObj = JSON.parse(playlistEndInfo);

        if (firstVideoInfo.id !== playlistEndInfoObj.id) {
            const { id, title, uploader, upload_date } = playlistEndInfoObj;
            const video_url = `https://www.youtube.com/watch?v=${id}`;
            log(`发现频道有更新 --> ${uploader}:${title}`);
            log(`更新视频的URL：${video_url}`);
            const dirPath = mkdir(uploader);
            const filename = getCurrentTime("yyyy_MM_dd") + "__" + id;

            const tags = title.match(/#\w+/g)?.map((t: string) => t && t?.slice(1));
            // "科普动画", "看动画学英语", "趣味故事", "科普一下", "英语口语", "动画英语"
            const translateTags: string[] = [...(channelItem?.prefix_tags || [])];
            const tagLessTitle = title.replace(/#\w+/g, "");

            if (tags && tags.length) {
                for (const tag of tags) {
                    const translateTag = await translate(tag, null, "zh-Hans");
                    translateTags.push(translateTag.translation);
                }
            }

            // xxx #shorts #funny #reels #tech #programming #coding #meme
            const translationTitle = await translate(tagLessTitle, null, "zh-Hans");
            // publish_prefix xxx #shorts #funny #reels #tech #programming #coding #meme
            const uploadTitle = channelItem.publish_prefix + translationTitle.translation?.slice(0, 80) || tagLessTitle || "文件名出问题啦～";

            const changedInfo: IChangedInfo = {
                user: channelItem.user,
                user_url: channelItem.user_url,
                blibli_classification: channelItem.blibli_classification,
                video_info: {
                    id,
                    video_url,
                    title,
                    uploader,
                    upload_date,
                    dirPath,
                    filename,
                    uploadTitle,
                    tags: translateTags,
                    published: []
                }
            };
            channelItem.videos.unshift(changedInfo.video_info);
            fs.writeFileSync(configPath, JSON.stringify(configObj), "utf-8");
            log("upload_log.json 写入成功");
            return changedInfo;
        }
    }
    return false;
};
export const listening = async (): Promise<IChangedInfo> => {
    return new Promise(resolve => {
        setTimeout(async () => {
            try {
                log("开启一轮频道监测～");
                const changedInfo = await checkChange();
                if (changedInfo) {
                    resolve(changedInfo);
                } else {
                    listening().then(resolve);
                }
            } catch (e) {
                error(`监听过程中捕获到错误,${interval / 1000}s后重新开启监听`, e);
                await delay(interval);
                listening().then(resolve);
            }
        }, interval);
    });
};

