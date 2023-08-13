/**
 * 按照任务传递的顺序逐一执行每个任务
 * 当其中一个任务返回false，后续任务不会执行
 * @param tasks
 */
export const executeTasksInOrder = async (tasks: Array<() => Promise<boolean>>): Promise<void> => {
    for (const task of tasks) {
        const result = await task();
        if (!result) {
            break;
        }
    }
};