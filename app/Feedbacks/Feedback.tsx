import {ActivityIndicator, StyleSheet, View} from "react-native";
import {useEffect, useState} from "react";
import {Feedback as FeedbackType, RootState} from "@/Types/types";
import getFeedbacks from "@/app/FetchRequests/getFeedbacks";
import {useSelector} from "react-redux";
import FeedbackRequests from "@/app/Feedbacks/FeedbackRequests";

const Feedback = () => {
    const [loading, setLoading] = useState(false)
    const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([])

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
        <View style={styles.container}>
            {loading ? <ActivityIndicator size="large" color="#367c2cb"/> :
                <View>
                    <FeedbackRequests feedbacks={feedbacks}/>
                </View>
            }

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
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