import fs from "fs";
import { translate } from "bing-translate-api";
import { getCustomTimeList } from "./utils/getCustomTimeList";
import { getCurrentTime, log, mkdir } from "./utils";
import { processSingleVideo } from "./processSingleVideo";
import { REGEXP_TAGS } from "./constant";
import type { Config, customTimeChannel, VideoInfo } from "upload_log.json";
import type { IChangedInfo } from "./listening";

export const handleCustomTime = async (channel: customTimeChannel, config: Config, configPath: string) => {
    let videoInfoList = await getCustomTimeList(channel);
    if (!videoInfoList || !videoInfoList.length) return log("没有获取到视频信息");

    for (const videoInfo of videoInfoList) {
        const {id, title, uploader}: { id: string, title: string, uploader: string } = videoInfo;

        const video_url = `https://www.youtube.com/watch?v=${id}`;
        const dirPath = mkdir(uploader);
        const filename = getCurrentTime("yyyy_MM_dd") + "__" + id;

        const tags = title.match(REGEXP_TAGS)?.map((t: string) => t && t?.slice(1));
        const translateTags: string[] = [...(channel?.prefix_tags || [])];
        const tagLessTitle = title.replace(REGEXP_TAGS, "");

        if (tags && tags.length) {
            for (const tag of tags) {
                const translateTag = await translate(tag, null, "zh-Hans");
                translateTags.push(translateTag.translation);
            }
        }

        const translationTitle = await translate(tagLessTitle, null, "zh-Hans");
        const uploadTitle = channel.publish_prefix + translationTitle.translation?.slice(0, 80) || tagLessTitle || "文件名出问题啦～";

        const video_info: VideoInfo = {
            id,
            video_url,
            title,
            dirPath,
            filename,
            uploadTitle,
            tags: translateTags,
        }
        const changedInfo = {
            ...channel,
            video_info
        } as any as IChangedInfo;

        // 开始走视频自动发布流程
        await processSingleVideo(changedInfo);

        // 视频发布成功,写入配置文件
        channel.videos.unshift(video_info);
        fs.writeFileSync(configPath, JSON.stringify(config), "utf-8");
        log(`${video_info.uploadTitle} 发布成功,成功写入配置文件`);
    }
}