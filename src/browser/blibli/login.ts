import {error, log} from "../../utils";
import type {Page} from "puppeteer";
import * as fs from "fs";
import path from "path";
import {puppeteerScreenshotDir} from "../../constant";

const cookiePath = path.resolve(__dirname, '../../../cookies.txt')

export const login = async (page: Page) => {
    const lastCookieString = fs.readFileSync(cookiePath);
    if (lastCookieString.length !== 0) {
        const cookies = JSON.parse(lastCookieString.toString());
        await page.setCookie(...cookies)
    }

    await page.goto('https://member.bilibili.com/platform/home');
    await page.screenshot({path: puppeteerScreenshotDir + '_1_login.png'})

    if (page.url() === 'https://passport.bilibili.com/login') {
        log('开始登录');
        const {BliBli_USERNAME, BliBli_PASSWORD} = process.env;
        if (!(BliBli_USERNAME && BliBli_PASSWORD)) {
            return error("B站账号密码不能为空");
        }
        await page.type("input[placeholder=\"请输入账号\"]", `${BliBli_USERNAME}`, {delay: 50})
        await page.type("input[placeholder=\"请输入密码\"]", `${BliBli_PASSWORD}`, {delay: 50})

        const loginBtn = await page.waitForSelector(".btn_wp > .btn_primary");
        // 点击登录按钮
        await loginBtn?.click();
        log('\n需要手动点击验证码！！！');
        await page.screenshot({path: puppeteerScreenshotDir + '_2_login.png'})

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

    try {
        const cookies = await page.cookies();
        const cookiesString = JSON.stringify(cookies);
        fs.writeFileSync(cookiePath, cookiesString);
    } catch (e) {
        error("cookie写入失败:", e)
    }

    log('成功进入创作中心')
    await page.screenshot({path: puppeteerScreenshotDir + '_3_login.png'})
}