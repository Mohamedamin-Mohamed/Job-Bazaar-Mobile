import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import Header from "./Header";
import React, {useState} from "react";
import NoApplications from "./NoApplicationsOrJobs";
import {NavigationProp} from "@react-navigation/core";
import updateApplication from "@/app/fetchRequests/updateApplication";
import {useSelector} from "react-redux";
import {Application, RootStackParamList, RootState} from "@/Types/types";

type ActiveProps = {
    navigation: NavigationProp<RootStackParamList, 'AppliedJobs'>,
    appliedJobs: Application[],
    activeApplications: number,
    refreshJobs: () => void,
    jobStatuses: Record<string, string>
}

const Active = ({navigation, appliedJobs, activeApplications, refreshJobs, jobStatuses}: ActiveProps) => {
    const [clicked, setClicked] = useState<Record<string, boolean>>({})
    const [loading, setLoading] = useState(false)

    const role = useSelector((state: RootState) => state.userInfo).role

    const parseDate = (dateString: string) => {
        const [month, day, year] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    // sort appliedJobs by applicationDate
    const sortedAppliedJobs = [...appliedJobs].sort((a, b) => {
        const dateA = parseDate(a.applicationDate).getTime()
        const dateB = parseDate(b.applicationDate).getTime()
        return dateB - dateA; // sort descending
    })

    const handleClick = (jobId: string) => {
        if (clicked[jobId]) {
            setClicked({[jobId]: false})
            return
        }
        setClicked({[jobId]: true})
    }

    const handleDismiss = (event: any) => {
        if (event.target === event.currentTarget) {
            setClicked({})
        }
    }

    const viewDescription = (application: Application) => {
        navigation.navigate('ViewApplicationDescription', {application})
    }

    const withdrawApplication = async (application: Application) => {

        try {
            setLoading(true)
            const applicationStatus = 'Candidate Withdrew Interest'
            const updateResponse = await updateApplication(application.applicantEmail, application.jobId, applicationStatus, new AbortController())
            handleClick(application.jobId)
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
                            {sortedAppliedJobs.map((application) => (
                                application.isActive === 'true' && jobStatuses[application.jobId] === 'active' && (
                                    <View key={application.jobId} style={styles.childViews}>
                                        <TouchableOpacity style={{width: "65%"}}
                                                          onPress={() => viewDescription(application)}>
                                            <Text style={styles.positionText}>{application.position}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            ))}

                        </>
                        : <NoApplications navigation={navigation} role={role}/>}
                </View>
            }
        </TouchableWithoutFeedback>
    )
}
const styles = StyleSheet.create({
    activity: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
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
export default Active