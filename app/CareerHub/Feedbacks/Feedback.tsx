import {Text, View} from "react-native";
import {useEffect, useState} from "react";
import {Feedback, RootState} from "@/app/Types/types";
import getFeedbacks from "@/app/fetchRequests/getFeedbacks";
import {useSelector} from "react-redux";

const Feedback = () => {
    const [loading, setLoading] = useState(false)
    const [feedbacks, setFeedbacks] = useState<Feedback | null>(null)

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
            <Text>Under Construction</Text>
        </View>
    )
}
export default Feedback