import fs from "fs";
import qrcode from "qrcode-terminal";
import { logger } from "../../utils";
import { COOKIE_PATH, isDev, puppeteerScreenshotDir } from "../../constant";
import type { Page } from "puppeteer";

export const login = async (page: Page) => {
    if (fs.existsSync(COOKIE_PATH)) {
        const lastCookieString = fs.readFileSync(COOKIE_PATH);
        if (lastCookieString.length !== 0) {
            const cookies = JSON.parse(lastCookieString.toString());
            await page.setCookie(...cookies);
        }
    }

    // 扫码登录
    page.on("response", async (response) => {
        const url = response.url();
        if (url.includes("https://passport.bilibili.com/x/passport-login/web/qrcode/generate") && response.request().method() === "GET") {
            const body = await response.json();
            const qrcodeUrl = body.data.url;
            qrcode.generate(qrcodeUrl, {small: true}, function (qrcode) {
                logger.info("请扫码登录(二维码有过期时间)");
                logger.info(qrcode);
            });
        }
    });

    await page.goto("https://member.bilibili.com/platform/home");
    isDev && await page.screenshot({path: puppeteerScreenshotDir + "_1_login.png"});

    if (page.url() === "https://passport.bilibili.com/login") {
        console.log("进入登录界面");
        // 等待页面刷新，登录成功
        await page.waitForNavigation({
            waitUntil: "load"
        });
        if (page.url() === "https://member.bilibili.com/platform") {
            logger.info("登录成功");
            await refreshCookie(page);
            return true;
        }
        return false;
    }

    logger.info("成功进入创作中心");

    await refreshCookie(page);
    isDev && await page.screenshot({path: puppeteerScreenshotDir + "_3_login.png"});
    return true;
};

// 刷新cookie
const refreshCookie = async (page: Page) => {
    try {
        const cookies = await page.cookies();
        const cookiesString = JSON.stringify(cookies);
        fs.writeFileSync(COOKIE_PATH, cookiesString);
    } catch (e) {
        logger.error("cookie写入失败:", e);
    }
};