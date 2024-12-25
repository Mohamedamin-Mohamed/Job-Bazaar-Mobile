import {Application, Job, RootStackParamList, RootState} from "../Types/types";
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useState} from "react";
import countApplications from "../countJobsOrApplications/countApplications";
import Active from "./ApplicationStatus/Active";
import InActive from "./ApplicationStatus/InActive";
import {NavigationProp} from "@react-navigation/core";
import NoApplicationsOrJobs from "@/app/Applications/ApplicationStatus/NoApplicationsOrJobs";
import CompanyInfo from "@/app/Applications/ViewJobDescription/CompanyInfo";
import {useSelector} from "react-redux";
import getJobById from "@/app/fetchRequests/getJobById";

type DisplayAppliedJobsProps = {
    navigation: NavigationProp<RootStackParamList, 'AppliedJobs'>,
    appliedJobs: Application[],
    refreshJobs: () => void
}

const DisplayAppliedJobs = ({navigation, appliedJobs, refreshJobs}: DisplayAppliedJobsProps) => {
    const [activeButton, setActiveButton] = useState('active');
    const [jobStatusesLoading, setJobStatusesLoading] = useState(true)
    const role = useSelector((state: RootState) => state.userInfo).role;
    const [jobStatuses, setJobStatuses] = useState<Record<string, string>>({});
    const {active, inactive} = countApplications(appliedJobs, jobStatuses);

    useEffect(() => {
        return navigation.addListener('focus', () => {
            refreshJobs();
        });
    }, [navigation, refreshJobs]);

    const fetchJobById = async (application: Application, controller: AbortController) => {
        try {
            const response = await getJobById(application.employerEmail, application.jobId, controller);
            if (response.ok) {
                const data: Job = await response.json();
                return data.jobStatus;
            }
        } catch (exp) {
            console.error(exp);
        }
    };

    const fetchAllJobStatuses = async (controller: AbortController) => {
        setJobStatusesLoading(true);
        const statuses: Record<string, string> = {};
        try {
            for (const application of appliedJobs) {
                const status = await fetchJobById(application, controller);
                if (status) {
                    statuses[application.jobId] = status;
                }
            }
        } catch (err) {
            console.error("Error fetching job statuses:", err);
        } finally {
            setJobStatuses(statuses);
            setJobStatusesLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        fetchAllJobStatuses(controller).catch(err => console.error(err));
        return () => {
            controller.abort();
        };
    }, [appliedJobs]);

    const renderedComponent =
        activeButton === "active" ? (
            <Active
                appliedJobs={appliedJobs}
                activeApplications={active}
                navigation={navigation}
                refreshJobs={refreshJobs}
                jobStatuses={jobStatuses}
            />
        ) : (
            <InActive
                appliedJobs={appliedJobs}
                inActiveApplications={inactive}
                navigation={navigation}
                refreshJobs={refreshJobs}
                jobStatuses={jobStatuses}
            />
        );

    return (
        <View style={styles.container}>
            <View style={styles.childContainer}>
                <Text style={styles.headerText}>My Applications</Text>
                {appliedJobs.length > 1 ? (
                    <>
                        <Text style={styles.text}>
                            As the employer is evaluating your qualifications, we may contact you
                            to provide additional information. Thank you for your interest and thank you for
                            using Job Bazaar.
                        </Text>
                        <View style={styles.activityButtons}>
                            <View style={{flex: 1}}>
                                <TouchableOpacity
                                    style={[styles.buttons, activeButton === 'active' && styles.buttonClicked]}
                                    onPress={() => setActiveButton('active')}
                                    disabled={jobStatusesLoading}>
                                    <Text style={styles.buttonsText}>
                                        Active ({jobStatusesLoading ? "..." : active})
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 1}}>
                                <TouchableOpacity
                                    style={[styles.buttons, activeButton !== 'active' && styles.buttonClicked]}
                                    onPress={() => setActiveButton('inactive')}
                                    disabled={jobStatusesLoading}>
                                    <Text style={styles.buttonsText}>
                                        Inactive ({jobStatusesLoading ? "..." : inactive})
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {jobStatusesLoading ? (
                            <ActivityIndicator size="large" color="#367c2b"
                                               style={{flex: 1, justifyContent: "center", alignItems: "center"}}/>
                        ) : (
                            renderedComponent
                        )}
                    </>
                ) : (
                    <NoApplicationsOrJobs navigation={navigation} role={role}/>
                )}
            </View>
            <View style={{justifyContent: "center", alignItems: "center", width: "90%"}}>
                <CompanyInfo role={role}/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 24,
        justifyContent: "center",
        alignItems: "center",
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
export default DisplayAppliedJobs