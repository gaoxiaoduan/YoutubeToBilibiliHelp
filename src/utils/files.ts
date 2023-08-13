import fs from "fs";
import path from "path";
import { CONFIG_PATH, OUTPUT_DIR } from "../constant";
import { logger } from "./logger";
import { IChangedInfo } from "../listening";

export const mkdir = (dirPath: string) => {
    const dir = path.resolve(OUTPUT_DIR, `./${dirPath}`);
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    return dir;
};

export const getConfigFile = () => {
    if (!fs.existsSync(CONFIG_PATH)) {
        logger.warn("配置文件upload.config.json不存在");
        return null;
    }
    const configStr = fs.readFileSync(CONFIG_PATH).toString();
    const config: uploadConfigType.Config = JSON.parse(configStr);
    return config;
};

export const setConfigFile = async (changedInfo: IChangedInfo, platform: "BZ") => {
    const config = getConfigFile();

    const findChannel = config?.uploads.find(item => item.user_url === changedInfo.user_url);

    changedInfo.video_info.platform.push(platform);
    findChannel?.videos.unshift(changedInfo.video_info);

    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config), "utf-8");
    logger.info("配置文件更新成功");
};