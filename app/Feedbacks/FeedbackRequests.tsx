import {ScrollView, View} from "react-native";
import {Feedback} from "@/Types/types";
import DateRange from "@/app/Feedbacks/DateRange";
import FeedbackDetails from "@/app/Feedbacks/FeedbackDetails";
import {useState} from "react";
import {addMonths} from "date-fns";

const FeedbackRequests = ({feedbacks}: { feedbacks: Feedback[] }) => {
    const [startDate, setStartDate] = useState<Date>(addMonths(new Date(), -1))
    const [endDate, setEndDate] = useState<Date>(new Date())

    const dates = {
        startDate: startDate,
        endDate: endDate
    }
    return (
        <View>
            <ScrollView>
                <DateRange setStartDate={(date: Date) => setStartDate(date)}
                           setEndDate={(date: Date) => setEndDate(date)} dates={dates}/>
                <FeedbackDetails dates={dates} feedbacks={feedbacks}/>
            </ScrollView>
        </View>
    )
}
export default FeedbackRequests