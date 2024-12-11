import {useEffect, useState} from "react";
import Toast from "react-native-toast-message";
import {Job, RootStackParamList, RootState} from "../Types/types";
import {ActivityIndicator, View} from "react-native";
import {useSelector} from "react-redux";
import NoJobs from "../404s/NoJobs";
import {StackNavigationProp} from "@react-navigation/stack";
import getAvailableJobs from "../fetchRequests/getAvailableJobs";
import DisplayAvailableJobs from "./DisplayAvailableJobs";

type AvailableJobsNavigationProp = StackNavigationProp<RootStackParamList, 'AvailableJobs'>

const AvailableJobs = ({navigation}: { navigation: AvailableJobsNavigationProp }) => {
    const [availableJobs, setAvailableJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(false)

    const userInfo = useSelector((state: RootState) => state.userInfo)
    const role = userInfo.role

    const fetchAvailableJobs = async (controller: AbortController) => {
        try {
            setLoading(true)
            const response = await getAvailableJobs(controller)
            if (response.ok) {
                const jobs: Job[] = await response.json()
                setAvailableJobs(jobs)
            }
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        const controller = new AbortController()
        const unsubscribe = navigation.addListener('focus', () => {
            fetchAvailableJobs(controller).catch(err => console.error(err))
        })
        return () => {
            unsubscribe()
            controller.abort()
        }
    }, []);

    const hasActiveJobs = availableJobs.some(job => job.jobStatus === "active");
    
    return (
        <View style={{justifyContent: "center", alignItems: "center", flex: 2.5}}>
            {loading ? <ActivityIndicator size="large" /> : <>
                {
                    hasActiveJobs ?
                        <DisplayAvailableJobs availableJobs={availableJobs} navigation={navigation}/> :
                        <NoJobs role={role} navigation={navigation}/>
                }
            </>}
            <Toast/>
        </View>
    )
}
export default AvailableJobs