import fs from "fs";
import { download, executeTasksInOrder, logger, processThumbnail, processVideo } from "./utils";
import { IChangedInfo } from "./listening";
import { upload } from "./utils/upload";

const downloadVideoJob = async (changedInfo: IChangedInfo) => {
    if (!changedInfo.skip_down_subs) {
        await download(changedInfo, true);
    }
    await download(changedInfo);
};

const processThumbnailJob = async (changedInfo: IChangedInfo) => {
    // 将webp格式的封面修改为png格式
    const {video_info} = changedInfo;
    const processThumbnailResult = await processThumbnail(video_info.dirPath, video_info.filename);
    if (!processThumbnailResult) return logger.error("封面格式转换失败");
};

const processVideoJob = async (changedInfo: IChangedInfo) => {
    const {video_info} = changedInfo;
    // 给视频加字幕
    const precessResult = await processVideo(video_info.dirPath, video_info.filename);
    if (!precessResult) return logger.error("视频处理未成功");
};

const uploadJob = async (changedInfo: IChangedInfo) => {
    // 开始自动上传
    await upload(changedInfo);
};

// 清理上传成功的文件
const clearFile = async (changedInfo: IChangedInfo) => {
    const {video_info} = changedInfo;
    fs.rmSync(video_info.dirPath, {recursive: true});
    logger.info("成功删除文件:", video_info.dirPath);
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