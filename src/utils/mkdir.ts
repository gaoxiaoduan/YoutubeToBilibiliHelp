import * as fs from "fs";
import * as path from "path";
import { OUTPUT_DIR } from "../constant";

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