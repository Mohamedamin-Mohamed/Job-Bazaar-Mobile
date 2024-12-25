import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Application, RootStackParamList, RootState} from "../../Types/types";
import Header from "./Header";
import {useState} from "react";
import ApplicationOptions from "./ApplicationOptions";
import NoApplications from "./NoApplicationsOrJobs";
import {NavigationProp} from "@react-navigation/core";
import {useSelector} from "react-redux";
import updateApplication from "@/app/fetchRequests/updateApplication";

type InActiveProps = {
    navigation: NavigationProp<RootStackParamList, 'AppliedJobs'>,
    appliedJobs: Application[],
    inActiveApplications: number,
    jobStatuses: Record<string, string>,
    refreshJobs: () => void
}
const InActive = ({navigation, appliedJobs, inActiveApplications, jobStatuses, refreshJobs}: InActiveProps) => {
    const [loading, setLoading] = useState(false)
    const [clicked, setClicked] = useState<Record<string, boolean>>({})
    const role = useSelector((state: RootState) => state.userInfo).role

    const parseDate = (dateString: string) => {
        const [month, day, year] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    // sorting appliedJobs by applicationDate
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

    const handleClickClose = (jobId: string) => {
        setClicked({[jobId]: false})
    }

    const viewDescription = (application: Application) => {
        navigation.navigate('ViewApplicationDescription', {application: application})
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
        <View>
            {inActiveApplications > 0 ?
                <>
                    <Header/>
                    {sortedAppliedJobs.map((application) => (
                        (application.isActive === 'false' || jobStatuses[application.jobId] === 'inActive') && (
                            <View key={application.jobId} style={styles.childViews}>
                                <TouchableOpacity onPress={() => viewDescription(application)}>
                                    <Text style={styles.positionText}>{application.position}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleClick(application.jobId)}>
                                    <Text style={{fontSize: 20}}>...</Text>
                                </TouchableOpacity>
                                {clicked[application.jobId] && (
                                    <ApplicationOptions navigation={navigation} application={application}
                                                        handleClickClose={handleClickClose} withdrawApp={withdrawApplication}/>
                                )}
                            </View>
                        )
                    ))}
                </>
                : <NoApplications navigation={navigation} role={role}/>}
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