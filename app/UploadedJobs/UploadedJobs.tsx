import {useEffect, useState} from "react";
import getAvailableJobs from "@/app/fetchRequests/getAvailableJobs";
import Toast from "react-native-toast-message";
import {Job} from "@/app/Types/types";
import {View} from "react-native";

const UploadedJobs = ({ navigation })=>{
    const[availableJobs, setAvailableJobs] = useState<Job[]>()
    const fetchAvailableJobs = async (controller: AbortController)=>{
        try{
            const response = await getAvailableJobs(controller)
            const availableJobs = await response.json()
            if(response.ok){
                setAvailableJobs(availableJobs)
            }
            else{
                const text = await response.text()
                Toast.show({
                    type: 'error',
                    text1: text,
                    onHide: ()=> navigation.goBack()
                })
            }
        }
        catch (err){
            console.error("Could not fetch available jobs")
        }
    }
    useEffect(() => {
        const controller = new AbortController()
        fetchAvailableJobs(controller).catch(err => console.error(err))
        return ()=>{
            controller.abort()
        }
    }, []);
    return (
        <View>
            {availableJobs?.filter(job => job.jobStatus === 'active').length === 0 (
                <NoAvailableJobs role=""
            )}
        </View>
    )
}
export default UploadedJobs