import puppeteer, { Page } from "puppeteer";
import { isDev, puppeteerUserDataDir, USER_AGENT, waitForSelectorTimeout } from "../constant";
import { information, login, uploadFile, uploadThumbnail } from "./blibli";
import { IChangedInfo } from "../listening";
import { logger } from "../utils";

export const blibliTasks = [
    {
        taskName: "登录",
        taskFn: login
    },
    {
        taskName: "文件上传",
        taskFn: uploadFile
    },
    {
        taskName: "上传封面",
        taskFn: uploadThumbnail
    },
    {
        taskName: "填写信息",
        taskFn: information
    },
];


interface ITasks {
    taskName: string; // 任务名
    url?: string; // 地址
    taskFn: (page: Page, changedInfo: IChangedInfo) => Promise<void | boolean>; // 任务函数
}

export const runBrowser = async (tasks: ITasks[], changedInfo: IChangedInfo, isClose: boolean = true) => {
    logger.info("启动浏览器");

    const browser = await puppeteer.launch({
        headless: !isDev, // 默认为true，无头模式
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        slowMo: 250,
        userDataDir: puppeteerUserDataDir,
        protocolTimeout: waitForSelectorTimeout
    });


    // 打开一个新tab页面
    const page = await browser.newPage();
    await page.setViewport({
        width: 1200,
        height: 1080,
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false
    });

    USER_AGENT && await page.setUserAgent(USER_AGENT);

    for (const task of tasks) {
        const {taskName, url, taskFn} = task;
        logger.info(`开始执行任务：${taskName}`);
        url && await page.goto(url);
        await taskFn(page, changedInfo);
    }

    // 关闭浏览器
    isClose && await browser.close();

    return true;
};