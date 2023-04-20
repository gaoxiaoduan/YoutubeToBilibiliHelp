import type {Page} from "puppeteer";
import {warn} from "../../utils";

export const information = async (page: Page, uploadTitle: string) => {
    // 1.填写文件名
    const title_input = await page.$('.video-title .input-val');

    // @ts-ignore
    const textLength = await title_input?.evaluate(input => input.value.length)
    for (let i = 0; i < textLength; i++) {
        title_input?.press('Backspace');
    }
    await page.type('.input-val', uploadTitle);

    // 2.选择分区 知识->科学科普
    const firstClass = 4; // '知识' -> 4
    const secondClass = 0; // '科学科普' -> 0
    await page.click('.select-item-cont-inserted');
    const f_item = await page.$$('.f-item-content');
    await f_item[firstClass].click()

    const f_main = await page.$$('.item-main');
    await f_main[secondClass].click()


    // 3.标签
    const tags = ['科普动画', '看动画学英语', '趣味故事', '科普一下', '英语口语', '动画英语']
    const tag_input = await page.$('.tag-input-wrp .input-val');
    for (let i = 0; i < tags.length; i++) {
        await tag_input?.type(tags[i]);
        await tag_input?.press('Enter');
    }
    // 简介 -> 先不填

    // await page.click('.label > .des'); // 点开更多设置
    //
    // // 个性化卡片
    // await page.click('.player-setting-wrp .bcc-button');
    //
    // // 关闭个性卡片弹窗
    // const player_setting_close = await page.waitForSelector('.bcc-dialog .player-setting-close')
    // await new Promise(r => setTimeout(r, 1000 * 2));
    // await player_setting_close?.click();


    await page.click('.submit-add');
    warn('投稿成功:', uploadTitle);
}