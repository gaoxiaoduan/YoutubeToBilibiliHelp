import YTDlpWrap from "yt-dlp-wrap";
import {log, error, warn} from "./log";
import {mkdir} from "./mkdir";

const ytdl = new YTDlpWrap();

function downloadVideoOrSubs(videoURL: string, dirPath: string, filename: string, isDownSubs: boolean = false) {
    return new Promise((resolve, reject) => {
        // 下载视频
        let commends = [`${videoURL}`, '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4', '--write-thumbnail', '-o', `${dirPath}/${filename}.%(ext)s`];
        if (isDownSubs) {
            // 下载字幕 '--write-sub', zh-CN,
            commends = [`${videoURL}`, '--write-auto-sub', '--write-sub', '--sub-lang', 'en,zh-Hans,zh-Hans-en', '--sub-format', 'vtt', '--skip-download', '-o', `${dirPath}/${filename}.%(ext)s`];
        }

        const content = isDownSubs ? '字幕' : '视频';
        warn(`-----${content} 开始下载-----`);

        const downloadChannel = ytdl.exec(commends);
        downloadChannel.on("ytDlpEvent", (eventType: string, eventData: string) => {
            process.stdout.write('\x1b[1A\x1b[2K');
            log(`${content}-`, eventType, eventData)
        })
            .on("error", (e: Error) => {
                reject(false)
                error(`${content}下载错误\n`, e)
            })
            .on("close", () => {
                resolve(true);
                log(`${content}下载完毕～\n`)
            });
    })
}

export const download = async (videoUrl: string, filename: string, isDownSubs: boolean = false) => {
    const process = isDownSubs ? "字幕" : "视频";
    warn(`-----${process}阶段开始-----\n`)
    log("videoURL", videoUrl);

    const metadata = await ytdl.getVideoInfo(videoUrl);
    metadata.filename = filename;
    // console.log(metadata)
    const {uploader, title} = metadata;
    warn(`视频作者：${uploader}`);
    warn(`视频标题：${title}`);

    const dirPath = mkdir(uploader);
    metadata.dirPath = dirPath;

    log('\noutput dir：', dirPath);

    try {
        const res = await downloadVideoOrSubs(videoUrl, dirPath, filename, isDownSubs);
        if (!res) return;
    } catch (e) {
        error("视频下载过程中出错：", e)
        return;
    }
    warn(`-----${process}阶段结束-----\n`)
    return metadata;
}