import { useState, useCallback } from "react";
import type { Task } from "../../Constants";

/**
 * @summary The interface that the component DisplayTasks will accept 
 * @property date: The date you want to display tasks for
 */
interface IDisplayTasks {
    date: Date
}

/**
 * @summary Displays a list of tasks for a specific date 
 */
export function DisplayTasks(props: IDisplayTasks) {
    const { date } = props;
    const [isEditingTask, setIsEditingTask] = useState<boolean>(false);
    const taskArray: Task[] = getTasks(date);

    const hideTaskFields = useCallback(() => {
        setIsEditingTask(false);
    }, []);

    return (
        <>
            {
                taskArray.map(task => (
                    <div>
                        { /* If a task is being edited, then we will display the fields to edit a task */}
                        {!isEditingTask ? (<>
                            <div>Task: {task.name}  Due: {task.date}  Estimate: {task.time} hours  Status: {getStatusString(task.status)}</div>
                            <button onClick={() => setIsEditingTask(true)} > Edit Task </button></>)
                            : <AddTaskFields onFinishTask={hideTaskFields} task={task} />
                        }
                    </div>
                ))
            }
        </>
    );
}

/** 
* @summary The interface to specify what properties the AddTaskFields component will accept
* @property onFinishTask: Callback to call when you want to hide these fields
* @property task: Optional property, utilized when you want to display the edit fields to modify a specific task
*/
interface IAddTaskFields {
    onFinishTask: () => void;
    task?: Task;
}

/**
 * @summary Displays the fields to edit a task
 */
export function AddTaskFields(props: IAddTaskFields) {
    const { onFinishTask, task } = props;

    const [taskId] = useState<number>(task != null ? task.id : getNextTaskId());
    const [taskName, setTaskName] = useState<string>(task != null ? task.name : "");
    const [taskDate, setTaskDate] = useState<string>(task != null ? task.date : "");
    const [taskTime, setTaskTime] = useState<number>(task != null ? task.time : 0);
    const [taskStatus, setTaskStatus] = useState<number>(task != null ? task.status : 1);

    const saveNewTask = useCallback(() => {

        let tasks = getTasks(taskDate);
        let newTask: Task = { id: taskId, name: taskName, date: taskDate, time: taskTime, status: taskStatus };

        // New task means we have to shift the next available Id
        if (task == null) {
            tasks.push(newTask);
            localStorage.setItem(newTask.date, JSON.stringify(tasks));
            localStorage.setItem("nextId", newTask.id.toString());
        }
        else {
            if (task.date != newTask.date) {
                // We need to remove the old task, and add it to the new day
                tasks.push(newTask);
                localStorage.setItem(newTask.date, JSON.stringify(tasks));

                tasks = getTasks(task.date);
                for (let i = 0; i < tasks.length; i++) {
                    if (tasks[i].id == newTask.id) {
                        tasks.splice(i, 1);
                        break;
                    }
                }
                localStorage.setItem(task.date, JSON.stringify(tasks));
            }
            else {
                // We need to update the existing task
                for (let i = 0; i < tasks.length; i++) {
                    if (tasks[i].id == newTask.id) {
                        tasks[i] = newTask;
                        break;
                    }
                }
                localStorage.setItem(newTask.date, JSON.stringify(tasks));
            }
        }

        onFinishTask();
    }, [taskName, taskDate, taskTime, taskStatus]);

    return (
        <div>
            { /* Add fields for the task information */}
            <div>Task Name: <input type="text" value={taskName} onChange={e => setTaskName(e.target.value)} placeholder="Task Name" /></div>
            <div>Due Date: <input type="date" value={taskDate} onChange={e => setTaskDate(e.target.value)} /></div>
            <div>Estimate (hrs): <input type="number" min={0} value={taskTime} onChange={e => setTaskTime(Number(e.target.value))} /></div>
            <div>Status: <input type="number" min={1} max={4} value={taskStatus} onChange={e => setTaskStatus(Number(e.target.value))} /></div>

            <button onClick={saveNewTask}>Save New Task</button>
            <button onClick={() => onFinishTask()}>Cancel</button>
        </div>
    );
}

/**
 * @summary Gets the list of tasks stored in the local database for the passed in date
 * @param date The date you want to retrieve tasks for
 * @returns The array of tasks stored on the database, or an empty array
 */
function getTasks(date: Date | string): Task[] {
    let databaseDate: string = "";
    if (date instanceof Date) {
        databaseDate = toSavedDate(date);
    }
    else {
        databaseDate = date;
    }
    const savedTasks: string | null = localStorage.getItem(databaseDate);

    if (savedTasks == null) {
        return [];
    }

    try {
        return JSON.parse(savedTasks) as Task[];
    } catch {
        return [];
    }
}

/**
 * @summary Gets the next task Id for new tasks.  
 * @returns The next available task Id
 */
function getNextTaskId() {
    let nextTaskIdJSON = localStorage.getItem("nextId");
    let nextTaskId: number = 0;

    if (nextTaskIdJSON == null) {
        nextTaskId = 1;
    }
    else {
        try {
            nextTaskId = Number(nextTaskIdJSON) + 1;
        } catch {
            return -1;
        }
    }

    return nextTaskId;
}

/**
* @summary Converts the passed in date into a string that will be saved to the database
* @param date The date to convert
* @returns The date in the format "yyyy-mm-dd" 
*/
function toSavedDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthZeroPadded = String(month).padStart(2, '0');
    const day = date.getDate();
    const dayZeroPadded = String(day).padStart(2, '0');
    return `${year}-${monthZeroPadded}-${dayZeroPadded}`;
}

/**
 * @summary Returns a user displayable string representing the status
 * Since it's getting close to time, I want to ensure this actually displayed to the user
 */
function getStatusString(status: number) {
    switch (status) {
        case 0:
            return "Not Started";
        case 1:
            return "Behind";
        case 2:
            return "On Track"; 
        case 3:
            return "Completed";
        default:
            return "Invalid Value";
    }
}