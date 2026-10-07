import { useCallback, useState } from 'react';
import './DailyPlanner.css';
import { AddTaskFields } from './Components/Tasks';
import { DisplayDate } from './Components/Dates';

/**
 * @summary Displays a weekly planner, where you can add, view, and edit tasks
 */
export function DailyPlanner() {
    let today: Date = new Date();
    const [startOfWeek] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()));
    const [weekOffset, setWeekOffset] = useState<number>(0);
    const [isAddingTask, setIsAddingTask] = useState<boolean>(false);

    const previousWeekCallback = useCallback(() => {
        setWeekOffset(weekOffset => weekOffset - 1);
    }, []);

    const nextWeekCallback = useCallback(() => {
        setWeekOffset(weekOffset => weekOffset + 1);
    }, []);

    const hideTaskFields = useCallback(() => {
        setIsAddingTask(false);
    }, []);

    return (
        <>
            <div>
                { /* Have buttons to go to the previous and next weeks */}
                <button onClick={previousWeekCallback}>Previous Week</button>
                <button onClick={nextWeekCallback}>Next Week</button>

                { /* If you click the button, we will display fields to display a new task */}
                {!isAddingTask ? <button onClick={() => setIsAddingTask(true)}>Add New Task</button>
                    : <AddTaskFields onFinishTask={hideTaskFields} />}

                { /* Display the current week of dates */}
                {Array.from({ length: 7 }, (_, i: number) => {
                    let displayedDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i + weekOffset*7);
                    return (
                        <DisplayDate date={displayedDate} />
                    );
                })}
            </div>
        </>
    )
}