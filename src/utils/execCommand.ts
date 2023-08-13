import { FfmpegCommand } from "fluent-ffmpeg";

/**
 * 执行给定的ffmpeg命令，并返回一个解析为布尔值的Promise。
 *
 * @param  {Function} command - 一个返回FfmpegCommand实例的函数
 * @return {Promise} - 一个解析为布尔值的Promise，表明执行是否成功
 */
export const executeFfmpegCommand = (command: () => FfmpegCommand): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const ffmpegCommand = command();

        ffmpegCommand
            .on("end", () => {
                resolve(true);
            })
            .on("error", (err) => {
                reject(err);
            })
            .run();
    });
};