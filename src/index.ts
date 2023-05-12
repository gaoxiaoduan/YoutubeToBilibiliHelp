import { download, error, executeTasksInOrder, log, processThumbnail, processVideo, upload } from "./utils";
import { IChangedInfo, listening } from "./listening";
import * as dotenv from "dotenv";
import { TASK_INTERVAL } from "./constant";

dotenv.config();

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
    if (!processThumbnailResult) return error("封面格式转换失败");
};

const processVideoJob = async (changedInfo: IChangedInfo) => {
    const {video_info} = changedInfo;
    // 给视频加字幕
    const precessResult = await processVideo(video_info.dirPath, video_info.filename);
    if (!precessResult) return error("视频处理未成功");
};

const uploadJob = async (changedInfo: IChangedInfo) => {
    // 开始自动上传
    await upload(changedInfo);
};

async function main() {
    log("项目启动～🚀");
    try {
        // 开始监听任务
        const changedInfo = await listening();

        const jobs = [
            downloadVideoJob.bind(null, changedInfo),
            processThumbnailJob.bind(null, changedInfo),
            processVideoJob.bind(null, changedInfo),
            uploadJob.bind(null, changedInfo),
        ];

        await executeTasksInOrder(jobs);

        // 执行完毕,继续新一轮监听任务
        log(`上一轮任务执行完毕,${TASK_INTERVAL / 1000}s后执行下一轮监听`);
        setTimeout(main, TASK_INTERVAL);
    } catch (e) {
        error("main:捕获到错误->", e);
        log(`main:捕获到错误->${TASK_INTERVAL / 1000}s后重新开启监听`);
        setTimeout(main, TASK_INTERVAL);
    }
}

main();


