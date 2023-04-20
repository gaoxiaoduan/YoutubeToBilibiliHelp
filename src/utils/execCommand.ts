import {error, log} from "./log";
import {spawn} from "child_process";

export const execCommand = (command: string, resolve: (value: (PromiseLike<unknown> | unknown)) => void, reject: (reason?: any) => void,) => {
    log('command:', command)
    const childProcess = spawn(command, {shell: true});
    childProcess.stdout.on('data', (data) => {
        log(data.toString()); // 输出标准输出内容
    });

    childProcess.stderr.on('data', (data) => {
        error(data.toString()); // 输出错误输出内容
    });

    childProcess.on('error', (err) => {
        error(err);
        reject(false);
    });

    childProcess.on('close', (code) => {
        log(`子进程退出，退出码：${code}`);
        resolve(true)
    });
}