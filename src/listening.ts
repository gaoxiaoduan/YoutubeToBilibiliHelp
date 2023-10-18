import { delay, getConfigFile, getPlaylistEnd, logger } from "./utils";
import { TASK_INTERVAL } from "./constant";
import { configChannel } from "./common";

export interface IChangedInfo extends uploadConfigType.Channel {
    video_info: uploadConfigType.VideoInfo;
}

//  读配置文件
// 循环遍历，判断内容是否更新
//  更新-》写文件，返回更新的标识 -> 视频的id｜url
//      -》走发布的代码流程
//      -》更新已发布平台信息
//      -》继续轮训，与json信息做比较
//  未更新返回false
const checkChange = async () => {
    const config = getConfigFile();

    for (const channelItem of config?.uploads || []) {
        let playlistEndInfo: string;
        try {
            await delay(1000 * 10);
            playlistEndInfo = await getPlaylistEnd(channelItem.user_url);
            if (playlistEndInfo === "") {
                logger.error(`最新视频信息获取失败：${channelItem.user_url}`);
                continue;
            }
        } catch (e) {
            logger.error(`捕获到错误：视频获取阶段 `, e);
            continue;
        }

        const playlistEndInfoObj = JSON.parse(playlistEndInfo);

        const videos = channelItem.videos;
        if (videos.length === 0 || videos[0].id !== playlistEndInfoObj.id) {
            const {id, title, uploader}: { id: string, title: string, uploader: string } = playlistEndInfoObj;
            return await configChannel(channelItem, id, title, uploader);
        }
    }
    return false;
};

export const listening = async (): Promise<IChangedInfo> => {
    return new Promise(async resolve => {
        try {
            logger.info("开启一轮频道监测～");
            const changedInfo = await checkChange();
            if (changedInfo) {
                resolve(changedInfo);
            } else {
                logger.info(`等待${TASK_INTERVAL / 1000}s后开启新一轮监听`);
                await delay(TASK_INTERVAL);
                listening().then(resolve);
            }
        } catch (e) {
            logger.error(`监听过程中捕获到错误,${TASK_INTERVAL / 1000}s后重新开启监听`, e);
            await delay(TASK_INTERVAL);
            listening().then(resolve);
        }
    });
};

