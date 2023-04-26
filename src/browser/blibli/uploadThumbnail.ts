import type {Page} from "puppeteer";
import {delay, log, warn} from "../../utils";

export const uploadThumbnail = async (page: Page, uploadThumbnail: string) => {
    await delay(1000 * 15);
    await page.click('.cover-upload-btn span:first-child');
    await delay(1000 * 5);
    await page.click('.bcc-dialog .cover-cut-header-tab-item:last-child > .text');


    log('开始选择上传封面文件')
    const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click('.cover-cut-footer-upload .bcc-upload .bcc-button'), // 上传文件按钮
    ]);

    // 选择要上传的文件
    await fileChooser.accept([uploadThumbnail]);
    log('封面文件选择成功：', uploadThumbnail)

    await page.click('.cover-cut-footer .bcc-button--primary');
    log('封面上传成功', uploadThumbnail);
}