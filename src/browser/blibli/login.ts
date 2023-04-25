import {log, warn} from "../../utils";
import type {Page} from "puppeteer";
import * as fs from "fs";
import path from "path";

const cookiePath = path.resolve(__dirname, '../../../cookies.txt')

export const login = async (page: Page) => {
    const lastCookieString = fs.readFileSync(cookiePath);
    if (lastCookieString.length !== 0) {
        const cookies = JSON.parse(lastCookieString.toString());
        await page.setCookie(...cookies)
    }

    await page.goto('https://member.bilibili.com/platform/home');
    // await page.screenshot({path: puppeteerScreenshotDir + '1_login.png'})
    // TODO：待修改登录逻辑
    const {BliBli_USERNAME, BliBli_PASSWORD} = process.env;
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

    const cookies = await page.cookies();
    const cookiesString = JSON.stringify(cookies);

    fs.writeFileSync(cookiePath, cookiesString);
    log('成功进入创作中心')
    // await page.screenshot({path: puppeteerScreenshotDir + '3_login.png'})
}