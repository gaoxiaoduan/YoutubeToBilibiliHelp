import { logger } from "./logger";
import { spawn } from "child_process";
import { isDev } from "../constant";

export const execCommand = (command: string, resolve: (value: (PromiseLike<unknown> | unknown)) => void, reject: (reason?: any) => void,) => {
    logger.warn("command:", command);
    const childProcess = spawn(command, {shell: true});
    childProcess.stdout.on("data", (data) => {
        if (isDev) {
            logger.info(data.toString()); // 输出标准输出内容
        }
    });

    // 进度显示
    childProcess.stderr.on("data", (data) => {
        if (isDev) {
            logger.warn(data.toString()); // 输出错误输出内容
        }
    });

    childProcess.on("error", (err) => {
        logger.error(err);
        reject(false);
    });

    childProcess.on("close", (code) => {
        logger.info(`命令执行完毕，子进程退出，退出码：${code}\n`);
        resolve(true);
    });
};