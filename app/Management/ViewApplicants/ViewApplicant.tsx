import {ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Job, JobApplicationData, RootStackParamList} from "@/Types/types";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import {useEffect, useState} from "react";
import getJobApplicants from "@/app/FetchRequests/getJobApplicants";
import ResumeViewer from "@/app/Modals/ResumeViewer";
import NoApplicants from "@/app/Management/ViewApplicants/NoApplicants";
import FeedbackModal from "@/app/Modals/FeedbackModal";
import getJobById from "@/app/FetchRequests/getJobById";

type ViewApplicantRouteProp = NativeStackScreenProps<RootStackParamList, 'ViewApplicants'>

type ResumeDetails = {
    resumeName: string,
    resume: string
}

const ViewApplicant = ({navigation, route}: ViewApplicantRouteProp) => {
    const {job} = route.params;
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [jobApplicants, setJobApplicants] = useState<JobApplicationData[]>([]);
    const [jobApplicant, setJobApplicant] = useState<JobApplicationData | null>(null)
    const [jobStatuses, setJobStatuses] = useState<{ [key: string]: string }>({})
    const [showResumeViewerModal, setShowResumeViewerModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [resumeDetails, setResumeDetails] = useState<ResumeDetails>({resumeName: '', resume: ''});

    if (!job) {
        Toast.show({
            type: 'error',
            text1: 'No Job Id found',
            onShow: () => setDisabled(true),
            onHide: () => setDisabled(false),
        });
    }

    const fetchJobApplicants = async (controller: AbortController) => {
        setLoading(true);
        try {
            const response = await getJobApplicants(job.jobId, controller);
            if (response.ok) {
                const applicants = await response.json();
                if (applicants && Array.isArray(applicants) && applicants.length > 0) {
                    setJobApplicants(applicants);
                }
            }
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    const fetchJobById = async (application: JobApplicationData, controller: AbortController) => {
        setLoading(true)
        try {
            const response = await getJobById(application.employerEmail, application.jobId, controller)
            if (response.ok) {
                const data: Job = await response.json()
                return data.jobStatus || ''
            }
            return ''
        } catch (err) {
            console.error(err)
            return ''
        } finally {
            setLoading(false)
        }
    }

    const fetchJobStatuses = async (applicants: JobApplicationData[], controller: AbortController) => {
        const statuses: Record<string, string> = {};
        for (const applicant of applicants) {
            try {
                statuses[applicant.jobId] = await fetchJobById(applicant, controller);
            } catch (err) {
                console.error(err);
            }
        }
        setJobStatuses(statuses);
    }

    useEffect(() => {
        const controller = new AbortController();
        fetchJobApplicants(controller).catch((err) => console.error(err));
        return () => {
            controller.abort();
        };
    }, [job]);

    useEffect(() => {
        if (jobApplicants.length > 0) {
            const controller = new AbortController();
            fetchJobStatuses(jobApplicants, controller).catch((err) => console.error(err));
            return () => {
                controller.abort();
            };
        }
    }, [jobApplicants]);

    const handleResumeShow = (application: JobApplicationData) => {
        setResumeDetails({resumeName: application.resumeName, resume: application.resume});
        setShowResumeViewerModal((prevState) => !prevState);
    };

    const handleResumeViewerDisplayModal = () => {
        setShowResumeViewerModal((prevState) => !prevState);
    };

    const handleFeedbackDisplayModal = () => {
        setShowFeedbackModal((prevState) => !prevState);
    };

    return loading ? (
        <ActivityIndicator size="large" color="#367c2b" style={styles.activityBar}/>
    ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={[styles.container, jobApplicants.length === 0 && {flex: 0}]}>
                <View style={styles.childContainer}>
                    <Text style={styles.position}>
                        {job.position} - {job.jobId}
                    </Text>
                    <View style={{gap: 10}}>
                        {jobApplicants.length > 0 ? (
                            jobApplicants.map((applicant) => {
                                const jobStatus = jobStatuses[applicant.jobId] || '';
                                return (
                                    <View key={applicant.applicantEmail} style={styles.applicantContainer}>
                                        <View style={styles.feedbackView}>
                                            <Text style={styles.applicantName}>
                                                {applicant.firstName} {applicant.lastName}
                                            </Text>
                                            {jobStatus === 'active' ?
                                                <TouchableOpacity
                                                    style={styles.feedbackButton}
                                                    onPress={() => {
                                                        setJobApplicant(applicant);
                                                        handleFeedbackDisplayModal();
                                                    }}>
                                                    <Text style={styles.feedbackText}>Leave Review</Text>
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity style={styles.inActiveApp}>
                                                    <Text style={styles.inActiveAppText}>Job Withdrawn</Text>
                                                </TouchableOpacity>
                                            }
                                        </View>
                                        <Text style={styles.applicantDetails}>Email: {applicant.applicantEmail}</Text>
                                        <Text
                                            style={styles.applicantDetails}>Applied: {applicant.applicationDate}</Text>
                                        <Text
                                            style={styles.applicantDetails}>Gender: {applicant.gender}</Text>
                                        <Text
                                            style={styles.applicantDetails}>Status: {applicant.applicationStatus}</Text>
                                        <Text style={styles.applicantDetails}>
                                            Location: {applicant.city}, {applicant.country}
                                        </Text>
                                        <Text style={styles.applicantDetails}>Employer
                                            Contact: {applicant.employerContact}</Text>
                                        <TouchableOpacity style={styles.resumeView}>
                                            <Text style={styles.applicantDetails}>Resume:</Text>
                                            <TouchableOpacity
                                                disabled={disabled}
                                                style={{maxWidth: '75%'}}
                                                onPress={() => handleResumeShow(applicant)}
                                            >
                                                <Text style={[styles.applicantDetails, styles.resumeLink]}>
                                                    {applicant.resumeName}
                                                </Text>
                                            </TouchableOpacity>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })
                        ) : (
                            <NoApplicants navigation={navigation} route={route}/>
                        )}
                    </View>
                    {showResumeViewerModal && (
                        <ResumeViewer handleDisplayModel={handleResumeViewerDisplayModal}
                                      resumeDetails={resumeDetails}/>
                    )}
                    {showFeedbackModal && jobApplicant !== null && (
                        <FeedbackModal jobApplicant={jobApplicant} handleDisplayModal={handleFeedbackDisplayModal}
                                       navigation={navigation}/>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    activityBar: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        flex: 1,
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
    feedbackView: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20
    },
    feedbackButton: {
        padding: 10,
        backgroundColor: "#28a745",
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
    },
    feedbackText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
    },
    position: {
        textAlign: "center",
        fontSize: 18,
        marginBottom: 20,
        fontWeight: "600",
    },
    applicantContainer: {
        gap: 4,
        padding: 16,
        marginBottom: 12,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderColor: '#ddd',
        borderWidth: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    applicantName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    resumeView: {
        flexDirection: "row",
        gap: 10
    },
    resumeLink: {
        color: "#0875e1",
        fontSize: 17,
    },
    applicantDetails: {
        fontSize: 17,
        color: '#666',
        marginBottom: 4,
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
})
export default ViewApplicant