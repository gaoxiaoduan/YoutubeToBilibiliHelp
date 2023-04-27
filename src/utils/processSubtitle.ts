import fs from "fs";
import { log } from "./log";


/**
 * 将双行字幕变成单行字幕
 * @param subtitlePath
 */
export const processSubtitle: (subtitlePath: string) => Promise<string> = (subtitlePath: string) => {
    return new Promise((resolve) => {
            const subString = fs.readFileSync(subtitlePath, "utf-8");
            const dataArray = subString.split("\n\n");
            const newDataArray = dataArray.map(item => {
                const itemArray = item.split("\n");
                if (itemArray.length === 3) {
                    // 00:01:11 ... <-- 时间戳
                    // dddd <--- 第一句话，此句是重复的
                    // xxx  <--- 第二句话，保留
                    // 删除多行字幕为单行，删除dddd
                    itemArray.splice(1, 1);
                    log(itemArray);
                }
                return itemArray.join("\n");
            });
            const newData = newDataArray.join("\n\n");
            fs.writeFileSync(subtitlePath, newData, "utf-8");
            resolve(subtitlePath);
        }
    );
};
