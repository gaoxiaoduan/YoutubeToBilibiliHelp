import type { Page } from "puppeteer";
import { delay, log } from "../../utils";
import { puppeteerScreenshotDir } from "../../constant";
import { getPoint } from "../../utils/getPoint";

export const information = async (page: Page, uploadTitle: string, classification = [4, 0], tags: string[] = []) => {
    log("1.开始填写标题");
    const title_input = await page.$(".video-title .input-val");

    // @ts-ignore
    const textLength = await title_input?.evaluate(input => input.value.length);
    for (let i = 0; i < textLength; i++) {
        title_input?.press("Backspace");
    }
    await page.type(".input-val", uploadTitle);
    log(`标题填写完成：${uploadTitle}`);

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
    await page.screenshot({path: puppeteerScreenshotDir + "_1_eng.png"});

    const verificationCodeElement = await page.waitForSelector(".geetest_panel_next");
    if (verificationCodeElement) {
        log("出现验证码");
        const verificationCodeSavePath = puppeteerScreenshotDir + "_verification_code.png";
        await verificationCodeElement.screenshot({
            path: verificationCodeSavePath,
        });

        const points = await getPoint(verificationCodeSavePath);
        if (points.length === 0) return;

        for (const [x, y] of points) {
            await delay(1000);
            await verificationCodeElement.click({
                offset: {
                    x: x,
                    y: y
                }
            });
        }
    }

    await delay(1000);
    const geetest_commit = await page.$(".geetest_commit");
    await geetest_commit?.click();
    log("投稿成功:", uploadTitle);
    await delay(1000 * 5);
};