import * as fs from "fs";
import * as path from "path";
import { outDir } from "../constant";

export const mkdir = (dirPath: string) => {
    const dir = path.resolve(__dirname, `../../${outDir}/${dirPath}`);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    return dir;
};