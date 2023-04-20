import path from "path";
import {execCommand} from "./execCommand";
import {warn} from "./log";


export const processThumbnail = (dirPath: string, filename: string) => {
    return new Promise((resolve, reject) => {
        warn('-----封面格式转换阶段开始-----\n');
        const thumbnail = path.resolve(dirPath, filename + '.webp');
        const outputThumbnail = path.resolve(dirPath, filename + '.png');

        // 转换视频格式 webp -> png
        const command = `ffmpeg -i "${thumbnail}" "${outputThumbnail}"`
        warn(command);
        execCommand(command, resolve, reject);
    })
}