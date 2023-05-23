import { error, log, warn } from "./log";
import { spawn } from "child_process";
import { isDev } from "../constant";

export const execCommand = (command: string, resolve: (value: (PromiseLike<unknown> | unknown)) => void, reject: (reason?: any) => void,) => {
    warn("command:", command);
    const childProcess = spawn(command, {shell: true});
    childProcess.stdout.on("data", (data) => {
        if (isDev) {
            log(data.toString()); // 输出标准输出内容
        }
    });

    // 进度显示
    childProcess.stderr.on("data", (data) => {
        if (isDev) {
            warn(data.toString()); // 输出错误输出内容
        }
    });

    childProcess.on("error", (err) => {
        error(err);
        reject(false);
    });

    childProcess.on("close", (code) => {
        log(`命令执行完毕，子进程退出，退出码：${code}\n`);
        resolve(true);
    });
};