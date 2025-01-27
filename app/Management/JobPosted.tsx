import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Job, RootStackParamList, RootState} from "@/Types/types";
import NoApplicationsOrJobs from "@/app/Applications/ApplicationStatus/NoApplicationsOrJobs";
import CompanyInfo from "@/app/Applications/ViewJobDescription/CompanyInfo";
import React, {useEffect, useState} from "react";
import countJobs from "@/app/countJobsOrApplications/countJobs";
import Active from "@/app/Management/JobStatus/Active";
import InActive from "@/app/Management/JobStatus/InActive";
import {NavigationProp} from "@react-navigation/core";
import {useSelector} from "react-redux";
import getApplicantsPerJob from "@/app/FetchRequests/getApplicantsPerJob";

interface JobPostedProps {
    navigation: NavigationProp<RootStackParamList, 'ManagementHub'>,
    uploadedJobs: Job[],
    refreshJobs: () => Promise<void>
}

const JobPosted = ({navigation, uploadedJobs, refreshJobs}: JobPostedProps) => {
    const [applicantsPerJob, setApplicantsPerJob] = useState<Record<string, number>>({});
    const [jobIds, setJobIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false)
    const [activeButton, setActiveButton] = useState('active')
    const {active, inactive} = countJobs(uploadedJobs)
    const userInfo = useSelector((state: RootState) => state.userInfo)
    const role = userInfo.role
    const names = {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName
    }

    useEffect(() => {
        return navigation.addListener('focus', async () => {
            await refreshJobs()
        })

    }, [navigation, refreshJobs]);

    const fetchApplicantsPerJob = async (controller: AbortController) => {
        setLoading(true)
        if (jobIds.length === 0) return;
        try {
            const response = await getApplicantsPerJob(jobIds, controller);
            if (response.ok) {
                const jobApplicationCounts = await response.json();
                setApplicantsPerJob(jobApplicationCounts);
            }
        } catch (err: any) {

        } finally {
            setLoading(false)
        }
    };

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

    const renderedComponent =
        loading ? <ActivityIndicator size="large" color="#367c2b"/> :
            (
                activeButton === "active" ? (
                    <Active uploadedJobs={uploadedJobs} activeApplications={active} navigation={navigation}
                            refreshJobs={refreshJobs} applicantsPerJob={applicantsPerJob}/>
                ) : (
                    <InActive uploadedJobs={uploadedJobs} inActiveApplications={inactive} navigation={navigation}
                              applicantsPerJob={applicantsPerJob}/>
                ))
    return (
        <>
            <Text style={[styles.nameText, {
                marginLeft: 24,
                marginTop: 40
            }]}>Welcome {names.firstName} {names.lastName}</Text>
            <View style={styles.container}>
                <View style={styles.childContainer}>
                    <Text style={styles.headerText}>Job Applications Overview</Text>
                    {uploadedJobs.length >= 1 ? (
                        <>
                            <Text style={styles.text}>As you evaluate the qualifications of the candidates, we encourage
                                you to reach out if you require additional information. Thank you for utilizing
                                Job Bazaar to find the right talent for your team.</Text>
                            <View style={styles.activityButtons}>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity
                                        style={[styles.buttons, activeButton === 'active' && styles.buttonClicked]}
                                        onPress={() => setActiveButton('active')}>
                                        <Text style={styles.buttonsText}>Active ({active})</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity
                                        style={[styles.buttons, activeButton !== 'active' && styles.buttonClicked]}
                                        onPress={() => setActiveButton('inactive')}>
                                        <Text style={styles.buttonsText}>Inactive ({inactive})</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {renderedComponent}
                        </>
                    ) : (
                        <NoApplicationsOrJobs navigation={navigation} role={role}/>
                    )}
                </View>
                <View style={{justifyContent: "center", alignItems: "center", width: "90%"}}>
                    <CompanyInfo role={role}/>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 50,
        justifyContent: "center",
        alignItems: "center"
    },
    childContainer: {
        width: "90%",
        padding: 24,
        backgroundColor: "white",
        borderColor: "white",
        borderRadius: 4,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold"
    },
    nameText: {
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 20
    },
    text: {
        fontSize: 16,
        marginVertical: 24,
    },
    activityButtons: {
        flexDirection: "row",
        marginVertical: 10,
    },
    buttons: {
        justifyContent: "center",
        alignItems: "center"
    },
    buttonsText: {
        fontSize: 17,
    },
    buttonClicked: {
        borderBottomWidth: 2.5,
        borderBottomColor: "#0875e1",
        paddingBottom: 10
    }

})
export default JobPosted