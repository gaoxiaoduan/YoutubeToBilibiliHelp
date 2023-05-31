import path from "path";
import fs from "fs";
import { warn } from "./log";
import type { Config } from "upload_log.json";

export const getConfigFile = () => {
    const configPath = path.resolve(__dirname, "../../upload_log.json");
    if (!fs.existsSync(configPath)) {
        warn("配置文件upload_log不存在");
        return {};
    }
    const configStr = fs.readFileSync(configPath).toString();
    const config: Config = JSON.parse(configStr);
    return {
        config,
        configPath
    };
}