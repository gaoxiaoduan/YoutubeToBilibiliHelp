import path from "path";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import { logger } from "../utils";
import { executeFfmpegCommand } from "../utils";


// 处理视频封面
export const processThumbnail = async (dirPath: string, filename: string) => {
    logger.info("-----封面格式转换阶段开始-----\n");
    const thumbnail = path.resolve(dirPath, filename + ".webp");
    const outputThumbnail = path.resolve(dirPath, filename + ".png");
    // 如果这个要转换格式的封面已经存在，跳过，表示之前已经转换过了
    if (fs.existsSync(outputThumbnail)) {
        return true;
    }

    // 转换视频格式 webp -> png
    // `ffmpeg -i "${thumbnail}" "${outputThumbnail}" -hide_banner`
    return await executeFfmpegCommand(() => ffmpeg()
        .input(thumbnail)
        .output(outputThumbnail)
        .outputOptions("-hide_banner")
    );
};