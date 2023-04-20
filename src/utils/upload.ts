import puppeteer from "puppeteer";
import path from "path";
import {log, warn} from "./log";
import {puppeteerUserDataDir} from "../constant";
import {information, login, uploadFile, uploadThumbnail} from "../browser/blibli";
import {translate} from 'bing-translate-api'

export const upload = async (metadata: any) => {
    warn('-----自动上传阶段开始-----\n');
    const {dirPath, filename, title} = metadata;
    log("dirPath:", dirPath);
    log('filename', filename)
    log("title:", title)

    const translationTitle = await translate(title, null, 'zh-Hans');
    const uploadTitle = '【科普英语动画】' + translationTitle.translation?.slice(0, 80) || title || '文件名出问题啦～';

    const outputFile = path.resolve(dirPath, filename + '.output.mp4')
    const outputThumbnail = path.resolve(dirPath, filename + '.png')

    log(outputFile);
    log(outputThumbnail);

    warn('启动浏览器...\n')
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 250,
        userDataDir: puppeteerUserDataDir
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
    await information(page, uploadTitle)


    // 关闭浏览器
    await browser.close();
}