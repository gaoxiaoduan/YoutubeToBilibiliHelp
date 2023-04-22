/**
 * 按照任务传递的顺序逐一执行每个任务
 * @param tasks
 */
export const executeTasksInOrder = async (tasks: Array<() => Promise<any>>): Promise<void> => {
    for (const task of tasks) {
        await task();
    }
}