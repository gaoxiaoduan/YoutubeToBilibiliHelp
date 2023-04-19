import {download, error, log, processVideo, upload} from "./utils";

const url1 = "https://www.youtube.com/shorts/TX0oX0CNmeY";

const url2 = "https://www.youtube.com/watch?v=9i_2XGb28Pg&t=1s";

const url3 = "https://www.youtube.com/watch?v=Wty2UwGsgf4";

const url4 = "https://www.youtube.com/watch?v=_k-kxGCOI9U";

const filename = '666';

async function appStart() {
    try {
        await download(url4, filename, true);
        const metadata = await download(url4, filename);
        if (!(metadata.dirPath || metadata.title)) {
            return error('没有获取到下载后的视频地址和标题')
        }
        // console.log(dirPath, title, 111)


        const precessResult = await processVideo(metadata.dirPath, metadata.filename);
        if (!precessResult) {
            return error("视频处理未成功");
        }

        // TODO:自动上传
        log('---开始自动上传---')
        upload(metadata.dirPath, metadata.filename);
    } catch (e) {
        console.error(e)
    }

}

appStart();


