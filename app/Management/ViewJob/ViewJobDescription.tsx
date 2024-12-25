import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {Job, RootStackParamList, RootState} from "@/app/Types/types";
import {ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Location from "@/app/Applications/ViewJobDescription/Location";
import Info from "@/app/Applications/ViewJobDescription/Info";
import JobDescription from "@/app/Applications/ViewJobDescription/JobDescription";
import Qualifications from "@/app/Applications/ViewJobDescription/Qualifications";
import {useEffect, useState} from "react";
import getUploadedJobs from "@/app/fetchRequests/getUploadedJobs";
import getApplicantsPerJob from "@/app/fetchRequests/getApplicantsPerJob";
import {useSelector} from "react-redux";
import Toast from "react-native-toast-message";

type ViewApplicationProps = NativeStackScreenProps<RootStackParamList, 'ViewJobDescription'>

const ViewJobDescription = ({route, navigation}: ViewApplicationProps) => {
    const {job} = route.params
    const [uploadedJobs, setUploadedJobs] = useState<Job[]>([]);
    const [applicantsPerJob, setApplicantsPerJob] = useState<Record<string, number>>({});
    const [jobIds, setJobIds] = useState<string[]>([]);
    const [disabled, setDisabled] = useState(false)
    const userInfo = useSelector((state: RootState) => state.userInfo)
    const employerEmail = userInfo.email
    const role = userInfo.role

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handleDateParsing = (date: string) => {
        const [month, day, year] = date.split('-').map(Number)

        const monthName = month ? monthNames[month - 1] : ''
        return monthName ? `${monthName} ${day}, ${year}` : ''

    }

    const viewJob = () => {
        navigation.navigate('ViewJob', {job})
    }

    const fetchUploadedJobs = async (controller: AbortController) => {
        try {
            const response = await getUploadedJobs(employerEmail, controller);
            if (response.ok) {
                const jobs = await response.json();
                setUploadedJobs(jobs);
            }
        } catch (err) {
            console.error("Error fetching uploaded jobs:", err);
        }
    };

    const handleNavigation = () => {
        navigation.navigate('ViewApplicants', {job})
    }

    const fetchApplicantsPerJob = async (controller: AbortController) => {
        if (jobIds.length === 0) return;
        try {
            const response = await getApplicantsPerJob(jobIds, controller);
            if (response.ok) {
                const jobApplicationCounts = await response.json();
                setApplicantsPerJob(jobApplicationCounts);
            }
        } catch (err) {
            console.error("Error fetching applicants per job:", err);
            Toast.show({
                type: 'error',
                text1: "Error, Unable to load applicant data. Please try again later.",
                onShow: () => setDisabled(true),
                onHide: () => setDisabled(false)
            })
        } finally {
        }
    };


    useEffect(() => {
        const controller = new AbortController()
        fetchUploadedJobs(controller).catch((err) => console.error(err));
        return () => {
            controller.abort()
        }
    }, []);


    useEffect(() => {
        const ids = uploadedJobs.map((job) => job.jobId);
        if (ids.length !== jobIds.length) {
            setJobIds(ids);
        }
    }, [uploadedJobs]);


    useEffect(() => {
        const controller = new AbortController()
        fetchApplicantsPerJob(controller).catch((err) => console.error(err));
        return () => {
            controller.abort()
        }
    }, [jobIds]);

    return (
        job ?
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.container}>
                    <View style={styles.childContainer}>
                        <Text style={styles.position}>{job.position}</Text>
                        <View>
                            <Text>You uploaded this job on {handleDateParsing(job.postedDate)}</Text>
                            <View style={{flexDirection: "row", gap: 10}}>
                                <TouchableOpacity disabled={disabled} style={styles.applicationButton}
                                                  onPress={() => viewJob()}>
                                    <Text style={styles.applicationButtonText}>View Job Desc.</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => handleNavigation()}
                                    disabled={disabled}
                                    style={styles.viewApplicants}>
                                    <Text style={styles.viewApplicantsText}>View Applicants</Text>
                                </TouchableOpacity>
                            </View>
                            {job.jobStatus === 'inActive' &&
                                <TouchableOpacity style={styles.inActiveApp}>
                                    <Text style={styles.inActiveAppText}>Job Withdrawn</Text>
                                </TouchableOpacity>
                            }
                            <Location job={job}
                                      postedDate={job.postedDate}
                                      {...(role === 'Employer' && {applicantsPerJob})}
                                      role={role}/>
                            <Info/>
                            <JobDescription description={job.description}/>
                            <Qualifications qualification={job.requirements}/>
                        </View>
                    </View>
                    <Toast/>
                </View>
            </ScrollView> :
            <ActivityIndicator style={styles.scrollContent} size="large" color="#367c2b"/>
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
        width: 150,
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
    viewApplicants: {
        backgroundColor: "#e6f0e1",
        width: 150,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        marginVertical: 10,
    },
    viewApplicantsText: {
        color: "#367c2b",
        fontSize: 16
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

export default ViewJobDescription