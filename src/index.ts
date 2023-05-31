import { error, getConfigFile, log } from "./utils";
import { listening } from "./listening";
import * as dotenv from "dotenv";
import { TASK_INTERVAL } from "./constant";
import { handleCustomTime } from "./handleCustomTime";
import { processSingleVideo } from "./processSingleVideo";

dotenv.config();

async function main() {
    log("项目启动～🚀");

    // 读取配置文件
    const {config, configPath} = getConfigFile();
    if (!config) return error("配置文件读取失败");
    if (config?.custom_time_channel) {
        log("根据自定义时间获取视频");
        await handleCustomTime(config?.custom_time_channel, config, configPath);
    } else {
        log("开始监听任务");
        try {
            // 开始监听任务
            const changedInfo = await listening();

            await processSingleVideo(changedInfo);

            // 执行完毕,继续新一轮监听任务
            log(`上一轮任务执行完毕,${TASK_INTERVAL / 1000}s后执行下一轮监听`);
            setTimeout(main, TASK_INTERVAL);
        } catch (e) {
            error("main:捕获到错误->", e);
            log(`main:捕获到错误->${TASK_INTERVAL / 1000}s后重新开启监听`);
            setTimeout(main, TASK_INTERVAL);
        }
    }
}

main();


