import DateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {addMonths} from "date-fns";

interface EndDatePickerProps {
    handleEndDateChange: (event: DateTimePickerEvent, selectedDate?: Date) => void,
    dates: {
        startDate: Date
        endDate: Date
    },
    disabled: boolean
}

const EndDatePicker = ({handleEndDateChange, dates, disabled}: EndDatePickerProps) => {

    return (
        <DateTimePicker
            disabled={disabled}
            value={dates.endDate}
            mode="date"
            display={"inline"}
            onChange={handleEndDateChange}
        />
    )
}
export default EndDatePicker