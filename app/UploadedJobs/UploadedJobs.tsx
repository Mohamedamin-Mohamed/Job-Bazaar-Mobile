import React, {useEffect, useState} from "react";
import Toast from "react-native-toast-message";
import {Job, RootStackParamList, RootState} from "@/Types/types";
import {ActivityIndicator, StyleSheet, View} from "react-native";
import getUploadedJobs from "@/app/FetchRequests/getUploadedJobs";
import {useSelector} from "react-redux";
import DisplayUploadedJobs from "./DisplayUploadedJobs";
import NoJobs from "../404s/NoJobs";
import {StackNavigationProp} from "@react-navigation/stack";

type UploadedJobsProp = StackNavigationProp<RootStackParamList, 'UploadedJobs'>

const UploadedJobs = ({navigation}: { navigation: UploadedJobsProp }) => {
    const [uploadedJobs, setUploadedJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(false)

    const userInfo = useSelector((state: RootState) => state.userInfo)
    const employerEmail = userInfo.email
    const role = userInfo.role

    const fetchUploadedJobs = async (controller: AbortController) => {
        try {
            setLoading(true)
            const response = await getUploadedJobs(employerEmail, controller)
            if (response.ok) {
                const uploadedJobs: Job[] = await response.json()
                setUploadedJobs(uploadedJobs)
            }
        } catch (exp) {
            throw exp
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        const controller = new AbortController()
        const fetchUploadedJobsWait = async ()=> {
            try{
                await fetchUploadedJobs(controller)
            }
            catch (err){
                console.error(err)
            }
        }
       fetchUploadedJobsWait().catch(err => console.error(err))
        return () => {
            controller.abort()
        }
    }, []);

    const hasActiveJobs = uploadedJobs.some(job => job.jobStatus === "active");

    return (
        <View style={styles.container}>
            {loading ? <ActivityIndicator size="large" color="#367c2b" /> : <>
                {
                    hasActiveJobs ?
                        <DisplayUploadedJobs uploadedJobs={uploadedJobs} employerEmail={employerEmail}
                                             navigation={navigation}/> :
                        <NoJobs role={role} navigation={navigation}/>
                }
            </>
            }
            <Toast/>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    }
})
export default UploadedJobs