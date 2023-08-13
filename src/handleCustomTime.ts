import fs from "fs";
import { getCustomTimeList } from "./utils/getCustomTimeList";
import { logger } from "./utils";
import { processSingleVideo } from "./processSingleVideo";
import { configChannel } from "./common";

export const handleCustomTime = async (channel: uploadConfigType.customTimeChannel, config: uploadConfigType.Config, configPath: string) => {
    let videoInfoList = await getCustomTimeList(channel);
    if (!videoInfoList || !videoInfoList.length) return logger.info("没有获取到视频信息");

    for (const videoInfo of videoInfoList) {
        const {id, title, uploader}: { id: string, title: string, uploader: string } = videoInfo;

        const changedInfo = await configChannel(channel, id, title, uploader);

        // 开始走视频自动发布流程
        await processSingleVideo(changedInfo);

        // 视频发布成功,写入配置文件
        channel.videos.unshift();
        fs.writeFileSync(configPath, JSON.stringify(config), "utf-8");
        logger.info(`${changedInfo.video_info.uploadTitle} 发布成功,成功写入配置文件`);
    }
};