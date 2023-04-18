import YTDlpWrap from "yt-dlp-wrap";
import {log, error, warn} from "./log";
import {mkdir} from "./mkdir";

const ytdl = new YTDlpWrap();

function downloadVideoOrSubs(videoURL: string, dirPath: string, isDownSubs: boolean = false) {
    // 下载视频
    let commends = [`${videoURL}`, '-f', 'best', '--merge-output-format', `mp4`, '-o', `${dirPath}/%(title)s.%(ext)s`];
    if (isDownSubs) {
        // 下载字幕
        commends = [`${videoURL}`, '--write-sub', '--write-auto-sub', '--sub-lang', 'en,zh-CN,zh-Hans', '--sub-format', 'vtt', '--skip-download', '-o', `${dirPath}/%(title)s.%(ext)s`];
    }

    const content = isDownSubs ? '字幕' : '视频';
    warn(`-----${content} 开始下载-----\n`);

    const downloadChannel = ytdl.exec(commends);
    downloadChannel.on("ytDlpEvent", (eventType: string, eventData: string) => {
        process.stdout.write('\x1b[1A\x1b[2K');
        log(`${content}-`, eventType, eventData)
    })
        .on("error", (e: Error) => error(`${content}下载错误\n`, e))
        .on("close", () => log(`${content}下载完毕～\n`));
}

export const download = async (videoUrl: string, isDownSubs: boolean = false) => {
    log("videoURL", videoUrl);

    const metadata = await ytdl.getVideoInfo(videoUrl);
    // console.log(metadata)
    const {uploader, title} = metadata;
    warn(`视频作者：${uploader}`);
    warn(`视频标题：${title}`);

    const dirPath = mkdir(uploader);

    log('output dir：', dirPath);

    if (isDownSubs) {
        // 下载字幕
        downloadVideoOrSubs(videoUrl, dirPath, true);
    }
    // 下载视频
    downloadVideoOrSubs(videoUrl, dirPath);
}