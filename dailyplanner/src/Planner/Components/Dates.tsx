import { DisplayTasks } from "./Tasks";

/**
 * @summary The interface for the properties that the DisplayDate component will accept
 * @property date: The date you want to display
 */
interface IDisplayDateProps {
    date: Date;
}

/**
 * @summary Displays the current date, alongside all tasks the user has specified 
 */
export function DisplayDate(props: IDisplayDateProps) {
    const { date } = props;

    return (
        <div>
            {date.toDateString()}
            <DisplayTasks date={date} />
        </div>
    );
}