import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import NoFeedback from "@/app/CareerHub/Feedbacks/NoFeedback";
import {Feedback} from "@/app/Types/types";
import {useState} from "react";
import Icon from 'react-native-vector-icons/MaterialIcons';
import FeedbackDetailsModal from "@/app/Modals/FeedbackDetailsModal";

interface FeedbackDetailsProps {
    dates: {
        startDate: Date,
        endDate: Date
    },
    feedbacks: Feedback[]
}

const FeedbackDetails = ({dates, feedbacks}: FeedbackDetailsProps) => {
    //state to be used to toggle display of feedbacks based on pressing of feedback date, by default its descending
    const [isDescendingFilterDate, setDescendingFilterDate] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)

    const parseDate = (date: string) => {
        const [month, year, day] = date.split('-').map(Number)
        return new Date(year, month - 1, day)
    }

    const filteredFeedbacks = feedbacks.filter(feedback => {
        const feedbackDate = parseDate(feedback.feedbackDate)
        return feedbackDate >= dates.startDate && feedbackDate <= dates.endDate
    })

    const sortedFeedbacks = filteredFeedbacks.sort((a, b) => {
        const dateA = parseDate(a.feedbackDate).getTime()
        const dateB = parseDate(b.feedbackDate).getTime()

        return isDescendingFilterDate ? dateB - dateA : dateA - dateB
    })

    const handleDisplayModal = () => {
        setShowModal(prevState => !prevState)
    }

    return (
        <View style={styles.container}>
            <View style={styles.childContainer}>
                <Text style={styles.headerText}>Feedbacks</Text>
                <View style={styles.feedbackHeaderView}>
                    <Text style={styles.feedbackHeaderText}>Job Id</Text>
                    <TouchableOpacity style={{flexDirection: "row"}} activeOpacity={0.8}
                                      onPress={() => setDescendingFilterDate(!isDescendingFilterDate)}>
                        <Text style={[styles.feedbackHeaderText, {marginLeft: 44}]}>Feedback Date</Text>
                        {sortedFeedbacks.length > 0 && (
                            isDescendingFilterDate ? (
                                <Icon name="arrow-downward" size={24}/>
                            ) : (
                                <Icon name="arrow-upward" size={24}/>
                            )
                        )}


                    </TouchableOpacity>
                    <Text style={styles.feedbackHeaderText}>Status</Text>
                </View>
                {sortedFeedbacks.length > 0 ?
                    <View style={styles.parentFeedbackViews}>
                        {sortedFeedbacks.map((feedback) => (
                            <View key={feedback.jobId} style={styles.feedbacksDisplayView}>
                                <TouchableOpacity onPress={() => {
                                    setSelectedFeedback(feedback)
                                    handleDisplayModal()
                                }}>
                                    <Text style={[styles.feedbackText, {color: "#007AFF", textDecorationLine: "underline"}]}>{feedback.jobId}</Text>
                                </TouchableOpacity>
                                <Text style={styles.feedbackText}>{feedback.feedbackDate}</Text>
                                <Text style={[styles.feedbackText, {maxWidth: "30%"}]}>{feedback.status}</Text>
                            </View>
                        ))}
                    </View>
                    : <NoFeedback/>
                }
            </View>
            {selectedFeedback && showModal &&
                <FeedbackDetailsModal feedback={selectedFeedback} handleDisplayModal={handleDisplayModal}/>}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        marginTop: 20,
        marginHorizontal: "4%",
    },
    childContainer: {
        padding: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "white",
    },
    headerText: {
        fontSize: 22,
        marginVertical: 16,
        marginLeft: 12,
        fontWeight: "500"
    },
    parentFeedbackViews: {
        marginLeft: 12,
    },
    feedbackHeaderView: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 12,
        marginVertical: 16,
        borderTopWidth: 0.5,
        borderTopColor: "gray",
        paddingTop: 16
    },
    feedbacksDisplayView: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderTopWidth: 0.5,
        borderTopColor: "gray",
        paddingTop: 24,
        marginBottom: 18
    },
    feedbackHeaderText: {
        fontSize: 18,
    },
    feedbackText: {
        fontSize: 18,
    },
    rotateButton90: {
        transform: [{rotate: "90deg"}]
    },
    rotateButton270: {
        transform: [{rotate: "270deg"}]
    }
})
export default FeedbackDetails