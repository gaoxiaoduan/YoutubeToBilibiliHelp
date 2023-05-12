import path from "path";
import { execCommand } from "./execCommand";
import { log } from "./log";
import fs from "fs";


export const processThumbnail = (dirPath: string, filename: string) => {
    return new Promise((resolve, reject) => {
        log("-----封面格式转换阶段开始-----\n");
        const thumbnail = path.resolve(dirPath, filename + ".webp");
        const outputThumbnail = path.resolve(dirPath, filename + ".png");
        // 如果这个要转换格式的封面已经存在，跳过，表示之前已经转换过了
        if (fs.existsSync(outputThumbnail)) {
            resolve(true);
            return;
        }
        // 转换视频格式 webp -> png
        const command = `ffmpeg -i "${thumbnail}" "${outputThumbnail}" -hide_banner`;
        execCommand(command, resolve, reject);
    });
};