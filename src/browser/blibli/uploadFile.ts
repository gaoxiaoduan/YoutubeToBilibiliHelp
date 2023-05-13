import type { Page } from "puppeteer";
import { delay, error, log } from "../../utils";
import { puppeteerScreenshotDir, waitForSelectorTimeout } from "../../constant";

export const uploadFile = async (page: Page, outputFile: string) => {
    const nav_upload_btn = await page.$("#nav_upload_btn");
    await nav_upload_btn?.click(); // 进入上传页面按钮

    await page.waitForNavigation(); // 等待路由跳转

    if (page.url() !== "https://member.bilibili.com/platform/upload/video/") {
        return error("未能成功进入视频上传页面");
    }
    log("进入视频上传页面");

    await delay(1000 * 3);
    log("开始选择上传文件");
    const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click(".upload-btn"), // 上传文件按钮
    ]);

    // 选择要上传的文件
    await fileChooser.accept([outputFile]);
    log("文件选择成功：", outputFile);

    await delay(1000 * 10);

    await page.screenshot({path: puppeteerScreenshotDir + "_1_upload_process.png"});

    // 等待上传成功，再填信息
    const success = await page.waitForSelector(".success", {timeout: waitForSelectorTimeout});
    if (!success) return error("未能上传成功");

    await page.screenshot({path: puppeteerScreenshotDir + "_2_upload_process.png"});

    log("文件上传成功，开始填写信息");
};