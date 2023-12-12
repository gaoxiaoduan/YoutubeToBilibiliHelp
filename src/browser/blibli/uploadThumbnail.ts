import fs from "fs";
import path from "path";
import type { Page } from "puppeteer";
import { delay, logger } from "../../utils";
import type { IChangedInfo } from "../../listening";

export const uploadThumbnail = async (page: Page, changedInfo: IChangedInfo) => {
    if (changedInfo?.skip_upload_thumbnail) return true;
    const {dirPath, filename} = changedInfo.video_info;
    const outputThumbnail = path.resolve(dirPath, filename + ".png");
    if (!fs.existsSync(outputThumbnail)) return true;

    await delay(1000 * 15);
    await page.click(".cover-upload-mask-btn span:first-child");
    await delay(1000 * 5);
    await page.click(".bcc-dialog .cover-select-header-tab-item:last-child > .text");


    logger.info("开始选择上传封面文件");
    const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click(".bcc-upload .bcc-button"), // 上传文件按钮
    ]);

    // 选择要上传的文件
    await fileChooser.accept([outputThumbnail]);

    // toaster-v2-wrp error
    try {
        const errorBox = await page.waitForSelector(".toaster-v2-wrp.error", {timeout: 1000 * 10});
        if (!errorBox) {
            logger.info("图片解析失败，请上传 960*600 尺寸以上图片 ->", outputThumbnail);
            await page.click(".bcc-dialog .cover-cut-header-icon");
            return false;
        }
    } catch (e) {
        logger.info("图片解析成功");
    }

    await page.click(".cover-select-footer-pick .bcc-button--primary");
    logger.info("封面上传成功", outputThumbnail);
    return true;
};