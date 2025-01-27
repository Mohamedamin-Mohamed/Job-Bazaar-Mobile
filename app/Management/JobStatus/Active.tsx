import {
    ActivityIndicator,
    GestureResponderEvent,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {NavigationProp} from "@react-navigation/core";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import Header from "@/app/Applications/ApplicationStatus/Header";
import NoApplicationsOrJobs from "@/app/Applications/ApplicationStatus/NoApplicationsOrJobs";
import updateJob from "@/app/FetchRequests/updateJob";
import {Job, RootStackParamList, RootState} from "@/Types/types";

interface InActiveProps {
    uploadedJobs: Job[],
    activeApplications: number,
    navigation: NavigationProp<RootStackParamList, 'ManagementHub'>,
    refreshJobs: () => void
    applicantsPerJob: Record<string, number>
}

const Active = ({uploadedJobs, activeApplications, navigation, refreshJobs, applicantsPerJob}: InActiveProps) => {
    const [clicked, setClicked] = useState<Record<string, boolean>>({})
    const [loading, setLoading] = useState(false)
    const userInfo = useSelector((state: RootState) => state.userInfo)
    const role = userInfo.role

    const parseDate = (dateString: string) => {
        const [month, day, year] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    // sorting appliedJobs by applicationDate
    const sortedUploadedJobs = [...uploadedJobs].sort((a, b) => {
        const dateA = parseDate(a.postedDate).getTime()
        const dateB = parseDate(b.postedDate).getTime()
        return dateB - dateA; // sort descending
    })

    const handleClick = (jobId: string) => {
        if (clicked[jobId]) {
            setClicked({[jobId]: false})
            return
        }
        setClicked({[jobId]: true})
    }

    const handleDismiss = (event: GestureResponderEvent) => {
        if (event.target === event.currentTarget) {
            setClicked({})
        }
    }

    const viewDescription = (job: Job) => {
        navigation.navigate('ViewJobDescription', {job, applicantsPerJob})
    }

    const withdrawJob = async (job: Job) => {
        try {
            setLoading(true)
            const jobStatus = 'inActive'
            const updateResponse = await updateJob(job.employerEmail, job.jobId, jobStatus, new AbortController())
            handleClick(job.jobId)
            if (updateResponse.ok) {
                refreshJobs()
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <TouchableWithoutFeedback onPress={handleDismiss}>
            {loading ? <ActivityIndicator size="large" color="#367c2b" style={styles.activity}/> :
                <View>
                    {activeApplications > 0 ?
                        <>
                            <Header/>
                            {sortedUploadedJobs.map((job) => (
                                job.jobStatus === 'active' && (
                                    <View key={job.jobId} style={styles.childViews}>
                                        <TouchableOpacity style={{width: "86%"}} onPress={() => viewDescription(job)}>
                                            <Text style={styles.positionText}>{job.position}</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.applicantsPerJob}>{applicantsPerJob[job.jobId] ?? 0}</Text>
                                    </View>
                                )
                            ))}

                        </>
                        : <NoApplicationsOrJobs navigation={navigation} role={role}/>}
                </View>
            }
        </TouchableWithoutFeedback>
    )
}
const styles = StyleSheet.create({
    activity: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    childViews: {
        marginVertical: 12,
        borderBottomWidth: 0.2,
        borderBottomColor: "gray",
        paddingBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "white"
    },
    positionText: {
        fontSize: 18,
        color: "#0875e1",
        marginTop: 4,
    },
    applicantsPerJob: {
        color: "#217a37",
        fontSize: 18
    }
})
export default Active