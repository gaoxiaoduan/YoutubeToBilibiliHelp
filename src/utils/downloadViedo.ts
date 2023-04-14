import fs from "fs";
import ytdl from 'ytdl-core';
import HttpsProxyAgent from 'https-proxy-agent'
import readline from "readline";

const proxy = 'http://127.0.0.1:7890';
const agent = HttpsProxyAgent(proxy);

const outDir = './videos';


let videoDetails: ytdl.MoreVideoDetails;

export const downloadVideo = async (videoUrl: string, fileName: string = "videos.mp4") => {
    console.log('开始获取视频info')
    const videoInfo = await ytdl.getInfo(videoUrl, {
        requestOptions: {agent}
    });

    videoDetails = videoInfo.videoDetails
    const user = videoDetails.author.user; // 用户名称/文件夹名称

    const downloadFileDir = `./${outDir}/${user}`;
    fs.mkdir(downloadFileDir, {recursive: true}, err => {
        if (err) console.error(`${downloadFileDir}文件夹，创建失败`);
    })
    const downloadFilePath = `${downloadFileDir}/${fileName}`


    console.log('开始请求视频url')
    const videoStream = ytdl(videoUrl, {
        requestOptions: {agent}
    })
    console.log('视频开始下载')
    videoStream.on('progress', (chunkLength, downloaded, total) => {
        const percent = downloaded / total;
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`视频下载中... ${(percent * 100).toFixed(2)}%`);
    });


    videoStream.pipe(fs.createWriteStream(downloadFilePath))
        .on('finish', () => {
            console.log(`\n视频:${fileName} 下载完成～`)
        })
        .on('error', (err) => {
            console.log(`\n视频:${fileName} 下载失败`, err)
        })
}

