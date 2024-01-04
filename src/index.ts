import "dotenv/config";
import { getConfigFile, logger } from "./utils";
import { listening } from "./listening";
import { CONFIG_PATH, isDev, TASK_INTERVAL } from "./constant";
import { handleCustomTime } from "./handleCustomTime";
import { processSingleVideo } from "./processSingleVideo";

async function main() {
    logger.info("项目启动～🚀");
    logger.info(`当前环境为：${isDev ? "开发环境" : "正式环境"}`);

    // 读取配置文件
    const config = getConfigFile();

    if (config?.custom_time_channel) {
        logger.info("根据自定义时间获取视频");
        await handleCustomTime(config?.custom_time_channel, config, CONFIG_PATH);
    } else {
        logger.info("开始监听任务");
        try {
            // 开始监听任务
            const changedInfo = await listening();

            // 处理单个视频
            await processSingleVideo(changedInfo);

            // 执行完毕,继续新一轮监听任务
            logger.info(`上一轮任务执行完毕,${TASK_INTERVAL / 1000}s后执行下一轮监听`);
        } catch (e) {
            logger.error("main:捕获到错误->", e);
            logger.info(`main:捕获到错误->${TASK_INTERVAL / 1000}s后重新开启监听`);
        } finally {
            setTimeout(main, TASK_INTERVAL);
        }
    }
}

main();
