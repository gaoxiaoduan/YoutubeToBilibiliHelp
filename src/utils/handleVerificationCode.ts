import fs from "fs";
import axios from "axios";
import type { Page } from "puppeteer";
import { delay } from "./delay";
import { logger } from "./logger";

const apiUrl = "http://api.ttshitu.com/predict";

const getPoints = async (imageFile: string): Promise<number[][]> => {
    let base64data = fs.readFileSync(imageFile).toString("base64");
    const {TJ_USERNAME, TJ_PASSWORD} = process.env;
    const {data: resultData} = await axios.post(apiUrl, {
        username: TJ_USERNAME,
        password: TJ_PASSWORD,
        typeid: "22",
        image: base64data
    });
    if (!resultData.success) {
        logger.error("验证码识别失败", resultData.success);
        return [];
    }
    const point = resultData.data.result;
    return point && processPoint(point);
};

// 处理字符串坐标为数组
//   '302,473|173,524|353,306'
// => [[302,473],[173,524],[353,306]]
const processPoint = (point: string) => {
    return point?.split("|")?.map(item => {
        const [x, y] = item.split(",");
        return [Number(x), Number(y)];
    });
};


export const handleVerificationCode = async (page: Page, puppeteerScreenshotDir: string) => {
    try {
        const verificationCodeElement = await page.waitForSelector(".geetest_panel_next");
        if (verificationCodeElement) {
            logger.info("出现验证码");
            const verificationCodeSavePath = puppeteerScreenshotDir + "_verification_code.png";
            await verificationCodeElement.screenshot({
                path: verificationCodeSavePath,
            });

            const points = await getPoints(verificationCodeSavePath);
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
    } catch (e) {
        logger.info("未捕获到验证码:", e);
    }
};
