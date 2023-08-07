import path from "path";

export const isDev = process.env.BUILD === "development"; // 开发环境

export const PROXY = "socks5://127.0.0.1:7890"; // 代理->设置为"",则不走代理｜若直连，可能会被墙，建议给终端走代理，这里默认使用clash本地代理

export const TASK_INTERVAL = isDev ? (1000 * 3) : (1000 * 60 * 10); // 监听频率 10分钟

export const waitForSelectorTimeout = 1000 * 60 * 60 * 2; // 等待上传时间

export const OUTPUT_DIR = path.resolve("./videos"); // 下载目录

export const COOKIE_PATH = path.resolve("./cookies.json"); // cookie文件路径

export const CONFIG_PATH = path.resolve("./upload_log.json"); // 配置文件路径

export const puppeteerUserDataDir = "puppeteer/user/data"; // puppeteer用户数据目录

export const puppeteerScreenshotDir = "puppeteer/user/screenshot"; // 截图目录

export const REGEXP_TAGS = /#(\w|[\u4e00-\u9fa5])+/g;

export const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36";