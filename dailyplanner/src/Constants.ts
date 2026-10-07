/**
 * @summary The interface for our Task data structure. We expect tasks to contain the following properties 
 * @property id: The id of the task
 * @property name: The name of the task
 * @property date: The date of the task
 * @property time: The time of the task
 * @property status: The status of the task
 */
export interface Task {
    id: number,
    name: string,
    date: string,
    time: number,
    status: number
}

export const TaskStatus: Record<string, number> = {
    "Not Started": 0,
    "Behind": 1,
    "On Track": 2,
    "Completed": 3,
};