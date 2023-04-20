import * as path from "path";
import {execCommand} from "./execCommand";
import {log, warn} from "./log";

// 给视频加字幕
export const processVideo = (dirPath: string, filename: string) => {
    return new Promise((resolve, reject) => {
        warn('-----加字幕阶段开始-----\n');
        log('processVideo:', dirPath, filename)

        const videoPath = path.resolve(dirPath, filename + '.mp4')
        const enSubtitle = path.resolve(dirPath, filename + '.en.vtt')
        // const zhSubtitle = path.resolve(dirPath, filename + '.zh-Hans.vtt');
        const zhSubtitle = path.resolve(dirPath, filename + '.zh-Hans-en.vtt');
        // TODO:文件不存在的判断

        const enStyle = 'FontSize=14,PrimaryColour=&H80ffff&,MarginV=30';
        const zhStyle = 'FontSize=14,PrimaryColour=&H80ffff&,MarginV=0';

        // 给视频压制双字幕
        const command = `ffmpeg -i "${videoPath}" -vf "subtitles=${enSubtitle}:force_style='${enStyle}',subtitles=${zhSubtitle}:force_style='${zhStyle}'" -c:a copy "${dirPath}/${filename}.output.mp4"`
        warn(command);
        execCommand(command, resolve, reject);
    })
}