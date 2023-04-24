import {log, warn} from "../../utils";
import type {Page} from "puppeteer";

export const login = async (page: Page) => {
    await page.goto('https://member.bilibili.com/platform/home');
    // await page.screenshot({path: puppeteerScreenshotDir + '1_login.png'})

    const {BliBli_USERNAME, BliBli_PASSWORD} = process.env;
    log(BliBli_USERNAME, BliBli_PASSWORD);
    if (page.url() === 'https://passport.bilibili.com/login') {
        log('开始登录');
        await page.type("input[placeholder=\"请输入账号\"]", `${BliBli_USERNAME}`, {delay: 50})
        await page.type("input[placeholder=\"请输入密码\"]", `${BliBli_PASSWORD}`, {delay: 50})
        // await page.screenshot({path: puppeteerScreenshotDir + '2_login.png'})

        const loginBtn = await page.waitForSelector(".btn_wp > .btn_primary");
        // 点击登录按钮
        await loginBtn?.click();
        warn('需要手动点击验证码！！！');

        while (true) {
            // 等待点击验证码后，页面重新加载
            await page.waitForNavigation({
                waitUntil: 'load'
            })
            if (page.url() === 'https://member.bilibili.com/platform/home') {
                log('登录成功')
                break;
            }
        }
    }
    log('成功进入创作中心')
    // await page.screenshot({path: puppeteerScreenshotDir + '3_login.png'})
}