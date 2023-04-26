import puppeteer from "puppeteer";
import path from "path";
import {log} from "./log";
import {isDev, puppeteerUserDataDir, waitForSelectorTimeout} from "../constant";
import {information, login, uploadFile, uploadThumbnail} from "../browser/blibli";
import {IChangedInfo} from "../listening";


export const upload = async (changedInfo: IChangedInfo) => {
    log('-----自动上传阶段开始-----\n');
    const {dirPath, filename, title, uploadTitle, tags} = changedInfo.video_info;
    log("dirPath:", dirPath);
    log('filename', filename)
    log("title:", title)

    const outputFile = path.resolve(dirPath, filename + '.output.mp4')
    const outputThumbnail = path.resolve(dirPath, filename + '.png')

    log(outputFile);
    log(outputThumbnail);

    log('启动浏览器...\n')
    const browser = await puppeteer.launch({
        headless: !isDev, // 默认为true，无头模式
        args: ['--no-sandbox'],
        slowMo: 250,
        userDataDir: puppeteerUserDataDir,
        protocolTimeout: waitForSelectorTimeout
    });

    // 打开一个新tab页面
    const page = await browser.newPage();
    await page.setViewport({
        width: 1200,
        height: 1080,
        deviceScaleFactor: 2,
        isMobile: false,
        hasTouch: false
    })

    // 登录
    await login(page);

    // 文件上传
    await uploadFile(page, outputFile);

    // 上传封面
    await uploadThumbnail(page, outputThumbnail)

    // 填写信息
    await information(page, uploadTitle, changedInfo.blibli_classification, tags)

    // 关闭浏览器
    await browser.close();
}