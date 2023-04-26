import {error, log, warn} from "./log";
import {getYTDL} from "./getYTDL";
import {IChangedInfo} from "../listening";
import path from "path";
import fs from "fs";

const ytdl = getYTDL();

function downloadVideoOrSubs(videoURL: string, dirPath: string, filename: string, isDownSubs: boolean = false) {
    return new Promise((resolve, reject) => {
        // 下载视频
        let commands = [`${videoURL}`, '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4', '--write-thumbnail', '-o', `${dirPath}/${filename}.%(ext)s`];
        if (isDownSubs) {
            // 下载字幕 '--write-sub', zh-CN,zh-Hans,
            // 中文字幕可能会下载2个格式的，zh-Hans|zh-Hans-en
            commands = [`${videoURL}`, '--write-auto-sub', '--write-sub', '--sub-lang', 'en,zh-Hans,zh-Hans-en', '--sub-format', 'vtt', '--skip-download', '-o', `${dirPath}/${filename}.%(ext)s`];
        }

        const content = isDownSubs ? '字幕' : '视频';

        const downloadChannel = ytdl.exec(commands);
        downloadChannel.on("ytDlpEvent", (eventType: string, eventData: string) => {
            process.stdout.write('\x1b[1A\x1b[2K');
            warn(`${content}-`, eventType, eventData)
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

export const download = async (changedInfo: IChangedInfo, isDownSubs: boolean = false) => {
    const process = isDownSubs ? "字幕" : "视频";
    const {
        video_url: videoUrl,
        uploader, title,
        dirPath,
        filename
    } = changedInfo.video_info;

    if (!isDownSubs) {
        const outputFilePath = path.resolve(dirPath, filename + '.mp4');
        if (fs.existsSync(outputFilePath)) {
            log(`-----${process} 已经存在-----\n`)
            return true;
        }
    }

    log(`-----${process}阶段开始-----\n`)

    try {
        const res = await downloadVideoOrSubs(videoUrl, dirPath, filename, isDownSubs);
        if (!res) return false;
    } catch (e) {
        error("视频下载过程中出错：", e)
        return;
    }
    log(`-----${process}阶段结束-----\n`)
    return true;
}