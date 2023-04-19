import {log} from "./log";
import path from "path";

export const upload = (dirPath: string, filename: string) => {
    log(dirPath, '--', filename);
    const outputFile = path.resolve(dirPath, filename + '.output.mp4')
    const thumbnail = path.resolve(dirPath, filename + '.webp')

    log(outputFile)
    log(thumbnail)
    // TODO:自动上传
}