import fs from "fs";
import { delay, error, getConfigFile, getCurrentTime, getPlaylistEnd, log, mkdir } from "./utils";
import { translate } from "bing-translate-api";
import { REGEXP_TAGS, TASK_INTERVAL } from "./constant";
import type { Channel, VideoInfo } from "upload_log.json";

export interface IChangedInfo extends Omit<Channel, "videos"> {
    video_info: VideoInfo;
}

//  读配置文件
// 循环遍历，判断内容是否更新
//  更新-》写文件，返回更新的标识 -> 视频的id｜url
//      -》走发布的代码流程
//      -》更新已发布平台信息
//      -》继续轮训，与json信息做比较
//  未更新返回false
const checkChange = async () => {
    const {config, configPath} = getConfigFile();
    if (!config) return error("配置文件读取失败");

    for (const channelItem of config.uploads) {
        let playlistEndInfo: string;
        try {
            playlistEndInfo = await getPlaylistEnd(channelItem.user_url);
            if (playlistEndInfo === "") {
                error(`最新视频信息获取失败：${channelItem.user_url}`);
                continue;
            }
        } catch (e) {
            error(`捕获到错误：视频获取阶段 `, e);
            continue;
        }

        const playlistEndInfoObj = JSON.parse(playlistEndInfo);

        const videos = channelItem.videos;
        if (videos.length === 0 || videos[0].id !== playlistEndInfoObj.id) {
            const {id, title, uploader}: { id: string, title: string, uploader: string } = playlistEndInfoObj;
            const video_url = `https://www.youtube.com/watch?v=${id}`;
            log(`发现频道有更新 --> ${uploader}:${title}`);
            log(`更新视频的URL：${video_url}`);
            const dirPath = mkdir(uploader);
            const filename = getCurrentTime("yyyy_MM_dd") + "__" + id;

            const tags = title.match(REGEXP_TAGS)?.map((t: string) => t && t?.slice(1)) || [];
            // "科普动画", "看动画学英语", "趣味故事", "科普一下", "英语口语", "动画英语"
            const translateTags: string[] = [...(channelItem?.prefix_tags || [])];
            const tagLessTitle = title.replace(REGEXP_TAGS, "");
            let uploadTitle = channelItem.publish_prefix || "";

            if (!channelItem.skip_translation_title) {
                if (tags && tags.length) {
                    for (const tag of tags) {
                        const translateTag = await translate(tag, null, "zh-Hans");
                        translateTags.push(translateTag.translation);
                    }
                }
                const translationTitle = await translate(tagLessTitle, null, "zh-Hans");
                uploadTitle += translationTitle.translation?.slice(0, 80) || tagLessTitle || "文件名出问题啦～";
            } else {
                uploadTitle += tagLessTitle || "文件名出问题啦～";
            }

            const changedInfo: IChangedInfo = {
                ...channelItem,
                video_info: {
                    id,
                    video_url,
                    title,
                    dirPath,
                    filename,
                    uploadTitle,
                    tags: !channelItem.skip_translation_title ? translateTags : tags,
                }
            };

            channelItem.videos.unshift(changedInfo.video_info);
            fs.writeFileSync(configPath, JSON.stringify(config), "utf-8");
            log("upload_log.json 写入成功");
            return changedInfo;
        }
    }
    return false;
};

export const listening = async (): Promise<IChangedInfo> => {
    return new Promise(async resolve => {
        try {
            log("开启一轮频道监测～");
            const changedInfo = await checkChange();
            if (changedInfo) {
                resolve(changedInfo);
            } else {
                log(`等待${TASK_INTERVAL / 1000}s后开启新一轮监听`);
                await delay(TASK_INTERVAL);
                listening().then(resolve);
            }
        } catch (e) {
            error(`监听过程中捕获到错误,${TASK_INTERVAL / 1000}s后重新开启监听`, e);
            await delay(TASK_INTERVAL);
            listening().then(resolve);
        }
    });
};

