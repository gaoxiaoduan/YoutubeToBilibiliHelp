import * as fs from "fs";
import path from "path";
import {error, getCurrentTime, getPlaylistEnd, log, mkdir, warn} from "./utils";
import {interval} from "./constant";
import * as upload_log from "upload_log.json";
import {translate} from "bing-translate-api";

type configType = typeof upload_log.default;

export interface IChangedInfo {
    user: string;
    user_url: string;
    video_info: {
        id: string;
        video_url: string;
        title: string;
        uploader: string;
        upload_date: string;
        dirPath: string;
        filename: string;
        uploadTitle: string;
        published: string[];
    }
}

//  读配置文件
// 循环遍历，判断内容是否更新
//  更新-》写文件，返回更新的标识 -> 视频的id｜url
//      -》走发布的代码流程
//      -》更新已发布平台信息
//      -》继续轮训，与json信息做比较
//  未更新返回false
const checkChange = async () => {
    const configPath = path.resolve(__dirname, '../upload_log.json');
    const config = fs.readFileSync(configPath).toString();
    const configObj: configType = JSON.parse(config);

    for (const channelItem of configObj.uploads) {
        const firstVideoInfo = channelItem.videos[0];
        const playlistEndInfo = await getPlaylistEnd(channelItem.user_url);
        if (playlistEndInfo === '') return error(`最新视频信息获取失败：${channelItem.user_url}`)
        const playlistEndInfoObj = JSON.parse(playlistEndInfo);

        if (firstVideoInfo.id !== playlistEndInfoObj.id) {
            const {id, title, uploader, upload_date} = playlistEndInfoObj;
            const video_url = `https://www.youtube.com/watch?v=${id}`;
            warn(`发现频道有更新 --> ${uploader}:${title}`);
            warn(`更新视频的URL：${video_url}`)
            const dirPath = mkdir(uploader);
            const filename = getCurrentTime('yyyy_MM_dd_hh') + '__' + id;

            const translationTitle = await translate(title, null, 'zh-Hans');
            const uploadTitle = channelItem.publish_prefix + translationTitle.translation?.slice(0, 80) || title || '文件名出问题啦～';

            const changedInfo: IChangedInfo = {
                user: channelItem.user,
                user_url: channelItem.user_url,
                video_info: {
                    id,
                    video_url,
                    title,
                    uploader,
                    upload_date,
                    dirPath,
                    filename,
                    uploadTitle,
                    published: []
                }
            };
            channelItem.videos.unshift(changedInfo.video_info);
            fs.writeFileSync(configPath, JSON.stringify(configObj), 'utf-8');
            log('upload_log.json 写入成功')
            return changedInfo;
        }
    }
    return false;
};
export const listening = async (): Promise<IChangedInfo> => {
    return new Promise(resolve => {
        setTimeout(async () => {
            const changedInfo = await checkChange();
            if (changedInfo) {
                resolve(changedInfo)
            } else {
                listening().then(resolve);
            }
        }, interval)
    })
}

