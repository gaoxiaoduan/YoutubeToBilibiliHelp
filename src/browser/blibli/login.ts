import { delay, logger } from "../../utils";
import type { Page } from "puppeteer";
import * as fs from "fs";
import { COOKIE_PATH, isDev, puppeteerScreenshotDir } from "../../constant";
import { handleVerificationCode } from "../../utils/handleVerificationCode";


export const login = async (page: Page) => {
    if (fs.existsSync(COOKIE_PATH)) {
        const lastCookieString = fs.readFileSync(COOKIE_PATH);
        if (lastCookieString.length !== 0) {
            const cookies = JSON.parse(lastCookieString.toString());
            await page.setCookie(...cookies);
        }
    }

    await page.goto("https://member.bilibili.com/platform/home");
    isDev && await page.screenshot({path: puppeteerScreenshotDir + "_1_login.png"});

    if (page.url() === "https://passport.bilibili.com/login") {
        logger.info("开始登录");
        const {BliBli_USERNAME, BliBli_PASSWORD} = process.env;
        if (!(BliBli_USERNAME && BliBli_PASSWORD)) {
            return logger.error("B站账号密码不能为空");
        }
        await page.type("input[placeholder=\"请输入账号\"]", `${BliBli_USERNAME}`, {delay: 50});
        await page.type("input[placeholder=\"请输入密码\"]", `${BliBli_PASSWORD}`, {delay: 50});

        const loginBtn = await page.waitForSelector(".btn_wp > .btn_primary");
        // 点击登录按钮
        await loginBtn?.click();
        await delay(1000 * 3);

        isDev && await page.screenshot({path: puppeteerScreenshotDir + "_2_login.png"});

        await handleVerificationCode(page, puppeteerScreenshotDir);

        while (true) {
            // TODO:替换成自动点击验证码
            // 等待点击验证码后，页面重新加载
            await page.waitForNavigation({
                waitUntil: "load"
            });
            if (page.url() === "https://member.bilibili.com/platform/home") {
                logger.info("登录成功");
                break;
            }
        }
    }

    try {
        const cookies = await page.cookies();
        const cookiesString = JSON.stringify(cookies);
        fs.writeFileSync(COOKIE_PATH, cookiesString);
    } catch (e) {
        logger.error("cookie写入失败:", e);
    }

    logger.info("成功进入创作中心");
    isDev && await page.screenshot({path: puppeteerScreenshotDir + "_3_login.png"});
};