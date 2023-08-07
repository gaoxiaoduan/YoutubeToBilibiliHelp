import path from "path";
import fs from "fs";
import type { Config } from "upload_log.json";
import { logger } from "./logger";

export const getConfigFile = () => {
    const configPath = path.resolve(__dirname, "../../upload_log.json");
    if (!fs.existsSync(configPath)) {
        logger.warn("配置文件upload_log不存在");
        return {};
    }
    const configStr = fs.readFileSync(configPath).toString();
    const config: Config = JSON.parse(configStr);
    return {
        config,
        configPath
    };
};