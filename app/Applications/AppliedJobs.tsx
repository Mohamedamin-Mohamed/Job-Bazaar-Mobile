import {Application, RootStackParamList, RootState} from "../Types/types";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {ActivityIndicator, ScrollView, StyleSheet, View} from "react-native";
import NoTasks from "./NoTasks";
import DisplayAppliedJobs from "./DisplayAppliedJobs";
import getAppliedJobs from "@/app/fetchRequests/getAppliedJobs";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import CompanyInfo from "@/app/Applications/ViewJobDescription/CompanyInfo";

type AppliedJobsNavigationProp = NativeStackScreenProps<RootStackParamList, 'AppliedJobs'>

const AppliedJobs = ({navigation, route}: AppliedJobsNavigationProp) => {
    let {jobs} = route.params
    const applicantEmail = useSelector((state: RootState) => state.userInfo).email
    const [loading, setLoading] = useState(false)
    const [appliedJobs, setAppliedJobs] = useState<Application[]>(jobs)

    const fetchAppliedJobs = async () => {
        setLoading(true);
        try {
            const fetchJobs = await getAppliedJobs(applicantEmail, new AbortController());
            const jobs = await fetchJobs.json()
            setAppliedJobs(jobs)
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppliedJobs().catch(err => console.error(err))
    }, []);

    return (
        <ScrollView>
            {loading ? <ActivityIndicator size="large" color="#367c2b" style={styles.activityBar}/> :
                <View>
                    <NoTasks/>
                    <DisplayAppliedJobs navigation={navigation} appliedJobs={appliedJobs}
                                        refreshJobs={fetchAppliedJobs}/>
                </View>
            }
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    activityBar: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})
export default AppliedJobs
