import {Job, RootStackParamList, RootState} from "../Types/types";
import {Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useState} from "react";
import getUserInfo from "../fetchRequests/getUserInfo";
import {StackNavigationProp} from "@react-navigation/stack";
import applicationChecker from "../fetchRequests/applicationChecker";
import {useSelector} from "react-redux";

type UploadedJobsNavigationProp = StackNavigationProp<RootStackParamList, 'UploadedJobs'>
type AvailableJobsNavigationProp = StackNavigationProp<RootStackParamList, 'AvailableJobs'>

type NavigationPropUnion = UploadedJobsNavigationProp | AvailableJobsNavigationProp

const JobsModal = ({job, handleDisplayModel, role, navigation}: {
    job: Job,
    handleDisplayModel: () => void,
    role: string,
    navigation: NavigationPropUnion
}) => {
    const [names, setNames] = useState<{ firstName: string, lastName: string }>()
    const userInfo = useSelector((state: RootState) => state.userInfo)
    const applicantEmail = userInfo.email
    const [applied, setApplied] = useState(false)

    const fetchEmployerInfo = async (employerEmail: string, controller: AbortController) => {
        try {
            const response = await getUserInfo(employerEmail, controller)
            if (response.ok) {
                const user = await response.json()
                setNames({firstName: user.firstName, lastName: user.lastName})
            }
        } catch (exp) {
            throw exp
        }
    }

    useEffect(() => {
        const controller = new AbortController()
        if (role === 'Applicant') fetchEmployerInfo(job.employerEmail, controller).catch(err => console.error(err))
        else {
            setNames({firstName: userInfo.firstName, lastName: userInfo.lastName})
        }
        return () => {
            controller.abort()
        }
    }, [role, job.employerEmail, userInfo, setNames]);

    const hasAppliedForJob = async (controller: AbortController) => {
        try {
            const response = await applicationChecker(applicantEmail, job.jobId, controller)
            const applied = await response.json()
            setApplied(applied)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        const controller = new AbortController()
        hasAppliedForJob(controller).catch(err => console.error(err))
        return () => {
            controller.abort()
        }
    }, []);

    const handleNavigation = () => {
        handleDisplayModel()
        if (role === 'Applicant') navigation.navigate('Apply', {job: job})
        else navigation.navigate('Edit', {job: job})
    }

    return (
        <View>
            {names && (
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={true}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        onPress={handleDisplayModel} // Close modal when pressing outside
                    >
                        <View style={styles.modalContent}>
                            <TouchableOpacity onPress={(e) => e.stopPropagation()}>
                                {/* Prevent closing when clicking inside the modal */}
                                {job && (
                                    <>
                                        <View style={{flexDirection: "row"}}>
                                            <Text style={styles.title}>{job.position}</Text>
                                            <TouchableOpacity
                                                style={[!applied && {marginLeft: "auto"}]}
                                                onPress={() => handleNavigation()}
                                                disabled={applied}
                                            >
                                                <Text
                                                    style={[styles.buttonText, applied && {width: 140}]}>{role === 'Employer' ? 'Edit Job' : applied ? 'Already Applied' : 'Apply Now'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.location}>Location: {job.location}</Text>
                                        <Text style={styles.function}>Function: {job.jobFunction}</Text>
                                        <Text style={styles.company}>Company: {job.company}</Text>
                                        <Text style={styles.jobUploader}>Hiring
                                            Manager: {names?.firstName} {names?.lastName}</Text>
                                        <Text style={styles.jobType}>Job Type: {job.jobType}</Text>
                                        <Text style={styles.jobId}>Job ID: {job.jobId}</Text>
                                    </>
                                )}
                                <TouchableOpacity onPress={handleDisplayModel} style={styles.closeButton}>
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        width: "60%"
    },
    location: {
        marginVertical: 7,
        fontSize: 16,
        fontStyle: 'italic',
    },
    function: {
        fontSize: 16,
        marginVertical: 7,
        fontStyle: 'italic',
    },
    company: {
        fontSize: 16,
        marginVertical: 7,
        fontStyle: 'italic',
    },
    jobUploader: {
        fontSize: 16,
        marginVertical: 7,
        fontStyle: 'italic',
    },
    jobType: {
        fontSize: 16,
        marginVertical: 7,
        fontStyle: 'italic',
    },
    jobId: {
        fontSize: 16,
        marginTop: 7,
        fontStyle: 'italic',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#367c2b',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18
    },
    buttonText: {
        backgroundColor: "#ffed00",
        fontWeight: "bold",
        width: 104,
        height: 36,
        textAlign: "center",
        padding: 8,
        fontSize: 16,
    },
});

export default JobsModal;