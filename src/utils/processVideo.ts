import * as path from "path";
import * as fs from "fs";
import {execCommand} from "./execCommand";
import {log, warn} from "./log";

// 给视频加字幕
export const processVideo = (dirPath: string, filename: string) => {
    return new Promise((resolve, reject) => {
        warn('-----加字幕阶段开始-----\n');
        log('processVideo:', dirPath, filename)

        const videoPath = path.resolve(dirPath, filename + '.mp4')
        const outputFile = path.resolve(dirPath, filename + '.output.mp4')

        // 如果要输出的视频（.output.mp4）已经存在，跳过，表示之前已经转换过了
        if (fs.existsSync(outputFile)) {
            return resolve(true);
        }

        const enStyle = 'FontSize=14,PrimaryColour=&H80ffff&,MarginV=30';
        const zhStyle = 'FontSize=14,PrimaryColour=&H80ffff&,MarginV=0';

        const enSubPath = path.resolve(dirPath, filename + '.en.vtt')
        const zhSubtitle = path.resolve(dirPath, filename + '.zh-Hans.vtt');
        const zhEnSubtitle = path.resolve(dirPath, filename + '.zh-Hans-en.vtt');

        if (!fs.existsSync(enSubPath)) {
            warn('英语字幕不存在,输出原视频');
            fs.copyFileSync(videoPath, outputFile);
            resolve(true);
        }

        let zhSubPath = ''; // 确定 中文字幕路径
        if (fs.existsSync(zhEnSubtitle)) {
            zhSubPath = zhEnSubtitle;
        } else if (fs.existsSync(zhSubtitle)) {
            zhSubPath = zhSubtitle;
        }

        // 给视频压制双字幕
        let command = `ffmpeg -i "${videoPath}" -vf "subtitles=${enSubPath}:force_style='${enStyle}',subtitles=${zhSubPath}:force_style='${zhStyle}'" -c:a copy "${outputFile}"`
        if (zhSubPath === '') {
            warn('中文字幕不存在,只压制英语字幕');
            command = `ffmpeg -i "${videoPath}" -vf "subtitles=${enSubPath}:force_style='${zhStyle}'" -c:a copy "${outputFile}"`
        }
        warn(command);
        execCommand(command, resolve, reject);
    })
}