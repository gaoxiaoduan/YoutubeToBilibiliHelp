import {spawn} from "child_process";
import {error, log} from "./log";
import * as path from "path";

// 给视频加字幕
export const processVideo = (dirPath: string, filename: string) => {
    return new Promise((resolve, reject) => {
        console.log('processVideo:', dirPath, filename)

        const videoPath = path.resolve(dirPath, filename + '.mp4')
        const enSubtitle = path.resolve(dirPath, filename + '.en.vtt')
        const zhSubtitle = path.resolve(dirPath, filename + '.zh-Hans.vtt');
        // TODO:文件不存在的判断

        const enStyle = 'FontSize=14,PrimaryColour=&H80ffff&,MarginV=30';
        const zhStyle = 'FontSize=14,PrimaryColour=&H80ffff&,MarginV=0';


        // ffmpeg -i 111.mp4 -vf subtitles=111.en.vtt:force_style='FontSize=14\,PrimaryColour=&H80ffff&\,MarginV=30',subtitles=111.vtt:force_style='FontSize=14\,PrimaryColour=&H80ffff&\,MarginV=0' -c:a copy output.mp4
        const command = `ffmpeg -i "${videoPath}" -vf "subtitles=${enSubtitle}:force_style='${enStyle}',subtitles=${zhSubtitle}:force_style='${zhStyle}'" -c:a copy "${dirPath}/${filename}.output.mp4"`
        log('command:', command)
        const childProcess = spawn(command, {shell: true});
        childProcess.stdout.on('data', (data) => {
            log(data.toString()); // 输出标准输出内容
        });

        childProcess.stderr.on('data', (data) => {
            error(data.toString()); // 输出错误输出内容
        });

        childProcess.on('error', (err) => {
            error(err);
            reject(false);
        });

        childProcess.on('close', (code) => {
            log(`子进程退出，退出码：${code}`);
            resolve(true)
        });
    })

}