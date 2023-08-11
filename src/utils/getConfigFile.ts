import fs from "fs";
import { logger } from "./logger";
import { CONFIG_PATH } from "../constant";

export const getConfigFile = () => {
    if (!fs.existsSync(CONFIG_PATH)) {
        logger.warn("配置文件upload.config.json不存在");
        return null;
    }
    const configStr = fs.readFileSync(CONFIG_PATH).toString();
    const config: uploadConfigType.Config = JSON.parse(configStr);
    return config;
};