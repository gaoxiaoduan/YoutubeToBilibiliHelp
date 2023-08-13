import { getCurrentTime, logger, mkdir } from "../utils";
import { REGEXP_TAGS } from "../constant";
import { translate } from "bing-translate-api";
import { IChangedInfo } from "../listening";

// 配置频道对应的json信息
export const configChannel = async (channel: uploadConfigType.Channel | uploadConfigType.customTimeChannel, id: string, title: string, uploader: string) => {

    const video_url = `https://www.youtube.com/watch?v=${id}`;
    logger.info(`发现频道有更新 --> ${uploader}:${title} [${video_url}]`);

    const dirPath = mkdir(uploader);
    const filename = getCurrentTime("yyyy_MM_dd") + "__" + id;

    const tags = title.match(REGEXP_TAGS)?.map((t: string) => t && t?.slice(1)) || [];

    const translateTags: string[] = [...(channel?.prefix_tags || ["vlog"])];

    const tagLessTitle = title.replace(REGEXP_TAGS, "");
    let uploadTitle = channel.publish_prefix || "";

    if (!channel.skip_translation_title) {
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
        ...channel,
        video_info: {
            id,
            video_url,
            title,
            dirPath,
            filename,
            uploadTitle,
            platform: [],
            tags: translateTags,
        }
    };

    return changedInfo;
};