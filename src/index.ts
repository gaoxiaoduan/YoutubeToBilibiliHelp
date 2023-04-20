import {download, error, processThumbnail, processVideo, upload} from "./utils";

const url1 = "https://www.youtube.com/shorts/TX0oX0CNmeY";

const url2 = "https://www.youtube.com/watch?v=9i_2XGb28Pg&t=1s";

const url3 = "https://www.youtube.com/watch?v=Wty2UwGsgf4";

const url4 = "https://www.youtube.com/watch?v=_k-kxGCOI9U";

const url5 = "https://www.youtube.com/watch?v=RoyHvfJowZI";

const filename = '666';

async function appStart() {
    try {
        await download(url5, filename, true);
        const metadata = await download(url5, filename);
        if (!(metadata.dirPath || metadata.title)) {
            return error('没有获取到下载后的视频地址和标题')
        }
        // console.log(dirPath, title, 111)

        // 将webp格式的封面修改为png格式
        const processThumbnailResult = await processThumbnail(metadata.dirPath, metadata.filename);
        if (!processThumbnailResult) return error('封面格式转换失败');

        // 给视频加字幕
        const precessResult = await processVideo(metadata.dirPath, metadata.filename);
        if (!precessResult) return error("视频处理未成功");

        // 开始自动上传
        await upload(metadata);
    } catch (e) {
        error(e)
    }

}

appStart();


