import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {Job, RootStackParamList, RootState} from "@/Types/types";
import {ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useState} from "react";
import getJobById from "@/app/FetchRequests/getJobById";
import Location from "@/app/Applications/ViewJobDescription/Location";
import Info from "@/app/Applications/ViewJobDescription/Info";
import JobDescription from "@/app/Applications/ViewJobDescription/JobDescription";
import Qualifications from "@/app/Applications/ViewJobDescription/Qualifications";
import {useSelector} from "react-redux";

type ViewApplicationProps = NativeStackScreenProps<RootStackParamList, 'ViewApplicationDescription'>

const ViewDescription = ({route, navigation}: ViewApplicationProps) => {
    const {application} = route.params
    const [job, setJob] = useState<Job | undefined>(undefined)
    const role = useSelector((state: RootState) => state.userInfo).role

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handleDateParsing = (date: string) => {
        const [month, day, year] = date.split('-').map(Number)

        const monthName = month ? monthNames[month - 1] : ''
        return monthName ? `${monthName} ${day}, ${year}` : ''
    }

    const fetchJobById = async (controller: AbortController) => {
        if (!application) {
            return;
        }

        try {
            const response = await getJobById(application.employerEmail, application.jobId, controller);
            if (response.ok) {
                const data: Job = await response.json();
                setJob(data);
            }
        } catch (err: any) {

        }
    }

    useEffect(() => {
        const controller = new AbortController()
        const fetchJobs = async (controller: AbortController) => {
            await fetchJobById(controller)
        }

        fetchJobs(controller).catch(err => console.error(err))

        return () => {
            controller.abort()
        }
    }, [application]);

    const viewApplication = () => {
        navigation.navigate('ViewApplication', {application})
    }

    return (
        job ?
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.container}>
                    <View style={styles.childContainer}>
                        <Text style={styles.position}>{application.position}</Text>
                        <View>
                            <Text>You applied for this job on {handleDateParsing(application.applicationDate)}</Text>
                            <TouchableOpacity style={styles.applicationButton} onPress={() => viewApplication()}>
                                <Text style={styles.applicationButtonText}>View Application Desc.</Text>
                            </TouchableOpacity>
                            {(application.isActive === "false") &&
                                <TouchableOpacity style={styles.inActiveApp}>
                                    <Text style={styles.inActiveAppText}>{application.applicationStatus}</Text>
                                </TouchableOpacity>
                            }
                            <Location job={job} postedDate={job.postedDate} role={role}/>
                            <Info/>
                            <JobDescription description={job.description}/>
                            <Qualifications qualification={job.requirements}/>
                        </View>
                    </View>
                </View>
            </ScrollView> : <ActivityIndicator style={styles.scrollContent} size="large" color="#367c2b"/>
    )
}
const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        width: "90%",
        alignItems: "center",
    },
    childContainer: {
        backgroundColor: "white",
        borderWidth: 1,
        borderRadius: 4,
        borderColor: "white",
        padding: 30,
        marginVertical: 20
    },
    position: {
        fontSize: 18,
        marginBottom: 20,
        fontWeight: "bold",
    },
    applicationButton: {
        backgroundColor: "#e6f0e1",
        width: 190,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        marginVertical: 10,
    },
    applicationButtonText: {
        color: "#367c2b",
        fontSize: 16,
    },
    inActiveApp: {
        backgroundColor: "#ffefee",
        alignSelf: "flex-start",
        height: 40,
        borderRadius: 4,
        justifyContent: "center",
        padding: 10
    },
    inActiveAppText: {
        color: "#a31b12",
        fontSize: 16
    }
});

export default ViewDescription