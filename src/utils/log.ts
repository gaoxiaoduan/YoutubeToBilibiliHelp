import chalk from 'chalk';

export const log = (...info: any[]) => console.log(chalk.blue(...info));
export const warn = (...info: any[]) => console.warn(chalk.yellow(...info));
export const error = (...info: any[]) => console.error(chalk.bold.red(...info));


