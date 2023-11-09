import path from "path";
import fs from "fs";
import { delay, logger } from "../../utils";
import { isDev, puppeteerScreenshotDir, waitForSelectorTimeout } from "../../constant";
import type { Page } from "puppeteer";
import type { IChangedInfo } from "../../listening";

export const uploadFile = async (page: Page, changedInfo: IChangedInfo) => {
    const {dirPath, filename} = changedInfo.video_info;

    const outputFile = path.resolve(dirPath, filename + ".output.mp4");
    if (!fs.existsSync(outputFile)) {
        logger.error(`输入文件不存在:${outputFile}`);
        return false;
    }

    const nav_upload_btn = await page.$("#nav_upload_btn");
    await nav_upload_btn?.click(); // 进入上传页面按钮

    await page.waitForNavigation(); // 等待路由跳转

    if (!page.url().includes("https://member.bilibili.com/platform/upload/video")) {
        logger.error("未能成功进入视频上传页面");
        return false;
    }
    logger.info("进入视频上传页面");


    await delay(1000 * 3);
    logger.info("开始选择上传文件");
    const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click(".upload-btn"), // 上传文件按钮
    ]);

    // 选择要上传的文件
    await fileChooser.accept([outputFile]);
    logger.info("文件选择成功：", outputFile);

    await delay(1000 * 10);
    try {
        const tipDialogCloseBtn = await page.$(".videoup-notification-dialog .bcc-dialog__footer > button");
        await tipDialogCloseBtn?.click();
    } catch (e) {
        logger.info("提示弹窗不存在");
    }

    isDev && await page.screenshot({path: puppeteerScreenshotDir + "_1_upload_process.png"});

    // 等待上传成功，再填信息
    const success = await page.waitForSelector(".success", {timeout: waitForSelectorTimeout});
    if (!success) {
        logger.error("未能上传成功");
        return false;
    }

    isDev && await page.screenshot({path: puppeteerScreenshotDir + "_2_upload_process.png"});

    logger.info("文件上传成功，开始填写信息");
    return true;
};