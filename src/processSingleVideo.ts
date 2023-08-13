import fs from "fs";
import { executeTasksInOrder, logger } from "./utils";
import { IChangedInfo } from "./listening";
import { download, processThumbnail, videoWithSubtitle } from "./processVideo";
import { blibliTasks, runBrowser } from "./browser";


const downloadVideoJob = async (changedInfo: IChangedInfo) => {
    let downSubsResult = false;
    if (!changedInfo.skip_down_subs) {
        downSubsResult = await download(changedInfo, true);
    }
    return downSubsResult && await download(changedInfo);
};

const processThumbnailJob = async (changedInfo: IChangedInfo) => {
    // 将webp格式的封面修改为png格式
    const {video_info} = changedInfo;
    return await processThumbnail(video_info.dirPath, video_info.filename);
};

const processVideoJob = async (changedInfo: IChangedInfo) => {
    const {video_info} = changedInfo;
    // 给视频加字幕
    return await videoWithSubtitle(video_info.dirPath, video_info.filename);
};

const uploadJob = async (changedInfo: IChangedInfo) => {
    // 开始自动上传
    return await runBrowser(blibliTasks, changedInfo);
};

// 清理上传成功的文件
const clearFile = async (changedInfo: IChangedInfo) => {
    const {video_info} = changedInfo;
    fs.rmSync(video_info.dirPath, {recursive: true, force: true});
    logger.info("成功删除文件:", video_info.dirPath);
    return true;
};

export const processSingleVideo = async (changedInfo: IChangedInfo) => {
    const jobs = [
        downloadVideoJob.bind(null, changedInfo),
        processThumbnailJob.bind(null, changedInfo),
        processVideoJob.bind(null, changedInfo),
        uploadJob.bind(null, changedInfo),
        clearFile.bind(null, changedInfo)
    ];

    await executeTasksInOrder(jobs);
};