import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Job, RootStackParamList, RootState} from "@/app/Types/types";
import {NavigationProp} from "@react-navigation/core";
import {useState} from "react";
import Header from "@/app/Applications/ApplicationStatus/Header";
import NoApplicationsOrJobs from "@/app/Applications/ApplicationStatus/NoApplicationsOrJobs";
import {useSelector} from "react-redux";
import JobOptions from "@/app/Management/JobStatus/JobOptions";

interface InActiveProps {
    uploadedJobs: Job[],
    inActiveApplications: number,
    navigation: NavigationProp<RootStackParamList, 'ManagementHub'>,
}

const InActive = ({uploadedJobs, inActiveApplications, navigation}: InActiveProps) => {
    const [clicked, setClicked] = useState<Record<string, boolean>>({})
    const [jobOptions, setJobOptions] = useState(false)
    const role = useSelector((state: RootState) => state.userInfo).role

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

    const handleClickClose = (jobId: string) => {
        setClicked({[jobId]: false})
    }

    const viewDescription = (job: Job) => {
        navigation.navigate('ViewJobDescription', {job: job})
    }

    return (
        <View>
            {inActiveApplications > 0 ?
                <>
                    <Header/>
                    {sortedUploadedJobs.map((job) => (
                        job.jobStatus === 'inActive' && (
                            <View key={job.jobId} style={styles.childViews}>
                                <TouchableOpacity onPress={() => viewDescription(job)}>
                                    <Text style={styles.positionText}>{job.position}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleClick(job.jobId)}>
                                    <Text style={{fontSize: 20}}>...</Text>
                                </TouchableOpacity>
                                {clicked[job.jobId] && (
                                    <JobOptions navigation={navigation} job={job}
                                                handleClickClose={handleClickClose}
                                    />
                                )}
                            </View>
                        )
                    ))}
                </>
                : <NoApplicationsOrJobs navigation={navigation} role={role}/>}
        </View>
    )
}
const styles = StyleSheet.create({
    childViews: {
        marginVertical: 12,
        borderBottomWidth: 0.2,
        borderBottomColor: "gray",
        paddingBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    positionText: {
        fontSize: 18,
        color: "#0875e1",
        marginTop: 4
    },
})
export default InActive