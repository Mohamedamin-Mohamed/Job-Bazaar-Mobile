import DateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {addMonths} from "date-fns";

interface StartDatePickerProps {
    handleStartDateChange: (event: DateTimePickerEvent, selectedDate?: Date) => void,
    dates: {
        startDate: Date,
        endDate: Date
    },
    disabled: boolean
}

const StartDatePicker = ({handleStartDateChange, dates, disabled}: StartDatePickerProps) => {

    return (
        <DateTimePicker
            disabled={disabled}
            value={dates.startDate}
            mode="date"
            display={"inline"}
            onChange={handleStartDateChange}
        />
    )
}
export default StartDatePicker