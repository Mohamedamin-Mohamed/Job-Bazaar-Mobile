import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Job, RootStackParamList, RootState} from "@/Types/types";
import {NavigationProp} from "@react-navigation/core";
import React from "react";
import Header from "@/app/Applications/ApplicationStatus/Header";
import NoApplicationsOrJobs from "@/app/Applications/ApplicationStatus/NoApplicationsOrJobs";
import {useSelector} from "react-redux";

interface InActiveProps {
    uploadedJobs: Job[],
    inActiveApplications: number,
    navigation: NavigationProp<RootStackParamList, 'ManagementHub'>,
    applicantsPerJob: Record<string, number>
}

const InActive = ({uploadedJobs, inActiveApplications, navigation, applicantsPerJob}: InActiveProps) => {
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

    const viewDescription = (job: Job) => {
        navigation.navigate('ViewJobDescription', {job: job, applicantsPerJob})
    }

    return (
        <View>
            {inActiveApplications > 0 ?
                <>
                    <Header/>
                    {sortedUploadedJobs.map((job) => (
                        job.jobStatus === 'inActive' && (
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
    applicantsPerJob: {
        color: "#a31b12",
        paddingHorizontal: 1,
        fontSize: 18
    }
})
export default InActive