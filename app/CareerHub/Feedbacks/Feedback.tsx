import {ActivityIndicator, StyleSheet, View} from "react-native";
import {useEffect, useState} from "react";
import {Feedback as FeedbackType, RootState} from "@/app/Types/types";
import getFeedbacks from "@/app/fetchRequests/getFeedbacks";
import {useSelector} from "react-redux";
import FeedbackRequests from "@/app/CareerHub/Feedbacks/FeedbackRequests";

const Feedback = () => {
    const [loading, setLoading] = useState(false)
    const [feedbacks, setFeedbacks] = useState<FeedbackType[] | null>(null)

    const applicantEmail = useSelector((state: RootState) => state.userInfo.email)

    const fetchFeedbacks = async (controller: AbortController) => {
        setLoading(true)
        try {
            const response = await getFeedbacks(applicantEmail, controller)
            setLoading(false)
            if (response.ok) {
                const data = await response.json()
                setFeedbacks(data)
            }
        } catch (err) {
            console.error("Couldn't fetch feedbacks ", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const controller = new AbortController()
        fetchFeedbacks(controller).catch(err => console.error(err))
    }, []);

    return (
        <View>
            {feedbacks ? (
                    <View>
                        <FeedbackRequests feedbacks={feedbacks} />
                    </View>
                ) :
                <ActivityIndicator size="large" color="#367c2cb"/>
            }

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center"
    },
    childContainer: {
        backgroundColor: "white",
        padding: 24,
        borderColor: "gray",
        borderRadius: 4,
        borderWidth: 1
    }
})
export default Feedback