import type { Page } from "puppeteer";
import { delay, log } from "../../utils";
import { isDev, puppeteerScreenshotDir } from "../../constant";
import { handleVerificationCode } from "../../utils/handleVerificationCode";
import { IChangedInfo } from "../../listening";

export const information = async (page: Page, changedInfo: IChangedInfo) => {
    const {uploadTitle, tags = [], video_url} = changedInfo.video_info;
    const {blibli_classification: classification = [0, 0], submission_categories = false} = changedInfo;
    log("1.开始填写标题");
    const title_input = await page.$(".video-title .input-val");

    // @ts-ignore
    const textLength = await title_input?.evaluate(input => input.value.length);
    for (let i = 0; i < textLength; i++) {
        title_input?.press("Backspace");
    }
    await page.type(".input-val", uploadTitle);
    log(`标题填写完成：${uploadTitle}`);

    if (!submission_categories) {
        log("选择投稿类型为:转载");
        await page.click(".type-check div:nth-child(2) > span.check-radio-v2-box");
        await delay(2000);
        await page.type(".type-source-input-wrp .input-val", video_url);
    }


    log("开始选择分区");
    // 2.选择分区 知识->科学科普
    const firstClass = classification[0]; // '知识' -> 4
    const secondClass = classification[1]; // '科学科普' -> 0
    await page.click(".select-item-cont-inserted");
    const f_item = await page.$$(".f-item-content");
    await f_item[firstClass].click();

    const f_main = await page.$$(".item-main");
    await f_main[secondClass].click();
    log("分区选择完成");

    log("开始填写标签");
    // 3.标签
    const tag_input = await page.$(".tag-input-wrp .input-val");
    for (let i = 0; i < tags.length; i++) {
        await tag_input?.type(tags[i]);
        await tag_input?.press("Enter");
    }
    log("标签填写完毕");
    // 简介 -> 先不填

    const submitBtn = await page.waitForSelector(".submit-add");
    await submitBtn?.click();
    await delay(1000 * 5);
    // 这个阶段可能会跳出验证码!
    isDev && await page.screenshot({path: puppeteerScreenshotDir + "_1_eng.png"});

    await handleVerificationCode(page, puppeteerScreenshotDir);

    log("投稿成功:", uploadTitle);
    await delay(1000 * 5);
};