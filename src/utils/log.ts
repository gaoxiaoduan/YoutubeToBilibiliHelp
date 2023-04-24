import chalk from 'chalk';
import {getCurrentTime} from "./getCurrentTime";

export const log = (...info: any[]) => console.log(getCurrentTime('yy-MM-dd hh:mm:ss') + chalk.blue(...info));
export const warn = (...info: any[]) => console.warn(getCurrentTime('yy-MM-dd hh:mm:ss') + chalk.yellow(...info));
export const error = (...info: any[]) => console.error(getCurrentTime('yy-MM-dd hh:mm:ss') + chalk.bold.red(...info));


