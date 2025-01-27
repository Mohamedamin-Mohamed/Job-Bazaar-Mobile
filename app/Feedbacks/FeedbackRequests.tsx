import {ScrollView, View} from "react-native";
import {Feedback} from "@/Types/types";
import NoFeedback from "@/app/CareerHub/Feedbacks/NoFeedback";
import DateRange from "@/app/CareerHub/Feedbacks/DateRange";
import FeedbackDetails from "@/app/CareerHub/Feedbacks/FeedbackDetails";
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
            {feedbacks.length > 0 ? (
                <ScrollView>
                    <DateRange setStartDate={(date: Date) => setStartDate(date)}
                               setEndDate={(date: Date) => setEndDate(date)} dates={dates}/>
                    <FeedbackDetails dates={dates} feedbacks={feedbacks}/>
                </ScrollView>
            ) : <NoFeedback/>}
        </View>
    )
}
export default FeedbackRequests