import * as fs from "fs";
import * as path from "path";
import { outDir } from "../constant";

export const mkdir = (dirPath: string) => {
    const outputDir = path.resolve(__dirname, `../../${outDir}`);
    const dir = path.resolve(outputDir, `./${dirPath}`);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    return dir;
};