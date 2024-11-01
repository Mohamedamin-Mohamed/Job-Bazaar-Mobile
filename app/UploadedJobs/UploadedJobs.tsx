import {useEffect, useState} from "react";
import Toast from "react-native-toast-message";
import {Job, RootStackParamList, RootState} from "@/app/Types/types";
import {View} from "react-native";
import getUploadedJobs from "@/app/fetchRequests/getUploadedJobs";
import {useSelector} from "react-redux";
import DisplayUploadedJobs from "@/app/UploadedJobs/DisplayUploadedJobs";
import NoJobs from "@/app/404s/NoJobs";
import {StackNavigationProp} from "@react-navigation/stack";

type UploadedJobsProp = StackNavigationProp<RootStackParamList, 'UploadedJobs'>

const UploadedJobs = ({ navigation } : {navigation: UploadedJobsProp}) => {
    const [uploadedJobs, setUploadedJobs] = useState<Job[]>([])

    const userInfo = useSelector((state: RootState) => state.userInfo)
    const employerEmail = userInfo.email
    const role = userInfo.role

    const fetchUploadedJobs = async (controller: AbortController) => {
        try {
            const response = await getUploadedJobs(employerEmail, controller)
            console.log('Response status is ', response.status)
            if (response.ok) {
                const uploadedJobs: Job[] = await response.json()
                setUploadedJobs(uploadedJobs)
            } else {
                const text = await response.text()
                Toast.show({
                    type: 'error',
                    text1: text,
                    onHide: () => navigation.goBack()
                })
            }
        } catch (err) {
            console.error("Could not fetch available jobs", err)
        }
    }
    useEffect(() => {
        const controller = new AbortController()
        fetchUploadedJobs(controller).catch(err => console.error(err))
        return () => {
            controller.abort()
        }
    }, []);

    const hasActiveJobs = uploadedJobs.some(job => job.jobStatus === "active");
    const x = 1
    return (
        <View>
            {hasActiveJobs ? <DisplayUploadedJobs uploadedJobs={uploadedJobs} employerEmail={employerEmail} navigation={navigation}/> :  <NoJobs role={role}/>}
            <Toast />
        </View>
    )
}
export default UploadedJobs