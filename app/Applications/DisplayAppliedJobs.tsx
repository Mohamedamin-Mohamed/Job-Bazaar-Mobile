import React, {useCallback, useEffect, useMemo, useState} from "react";
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Application, Job, RootStackParamList, RootState} from "@/Types/types";
import {NavigationProp} from "@react-navigation/core";
import {useSelector} from "react-redux";
import countApplications from "../countJobsOrApplications/countApplications";
import getJobById from "@/app/fetchRequests/getJobById";
import Active from "./ApplicationStatus/Active";
import InActive from "./ApplicationStatus/InActive";
import NoApplicationsOrJobs from "@/app/Applications/ApplicationStatus/NoApplicationsOrJobs";
import CompanyInfo from "@/app/Applications/ViewJobDescription/CompanyInfo";

interface DisplayAppliedJobsProps {
    navigation: NavigationProp<RootStackParamList, 'AppliedJobs'>;
    appliedJobs: Application[];
    refreshJobs: ()=> void
}

type TabType = 'active' | 'inactive';

const DisplayAppliedJobs = ({navigation, appliedJobs, refreshJobs}: DisplayAppliedJobsProps) => {
    const [activeTab, setActiveTab] = useState<TabType>('active');
    const [jobStatusesLoading, setJobStatusesLoading] = useState(true);
    const [jobStatuses, setJobStatuses] = useState<Record<string, string>>({});

    const role = useSelector((state: RootState) => state.userInfo.role);

    const fetchJobById = useCallback(async (
        application: Application,
        controller: AbortController
    ): Promise<string | undefined> => {
        try {
            const response = await getJobById(
                application.employerEmail,
                application.jobId,
                controller
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: Job = await response.json();
            return data.jobStatus;
        } catch (err) {
            if (!(err instanceof DOMException && err.name === 'AbortError')) {
                console.error('Error fetching job status:', err);
            }
        }
    }, []);

    const fetchAllJobStatuses = useCallback(async (controller: AbortController) => {
        setJobStatusesLoading(true);
        try {
            const statusPromises = appliedJobs.map(application =>
                fetchJobById(application, controller)
                    .then(status => ({jobId: application.jobId, status}))
            );

            const results = await Promise.all(statusPromises);

            const newStatuses = results.reduce((acc, result) => {
                if (result?.status) {
                    acc[result.jobId] = result.status;
                }
                return acc;
            }, {} as Record<string, string>);

            setJobStatuses(newStatuses);
        } catch (err) {
            console.error("Error fetching job statuses:", err);

        } finally {
            setJobStatusesLoading(false);
        }
    }, [appliedJobs, fetchJobById]);

    useEffect(() => {
        const controller = new AbortController();
        const unsubscribe = navigation.addListener('focus', refreshJobs);

        return () => {
            unsubscribe();
            controller.abort();
        };
    }, [navigation, refreshJobs]);

    useEffect(() => {
        const controller = new AbortController();
        fetchAllJobStatuses(controller).catch(err => console.error(err));
        return () => controller.abort();
    }, []);

    const {active, inactive} = useMemo(() =>
            countApplications(appliedJobs, jobStatuses),
        [appliedJobs, jobStatuses]
    );

    const renderTabButton = (tab: TabType, count: number, label: string) => (
        <View style={styles.tabButtonContainer}>
            <TouchableOpacity style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
                              onPress={() => setActiveTab(tab)} disabled={jobStatusesLoading}>
                <Text style={styles.tabButtonText}>
                    {label} ({jobStatusesLoading ? "..." : count})
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderContent = () => {
        if (jobStatusesLoading) {
            return (
                <ActivityIndicator
                    size="large"
                    color="#367c2b"
                    style={styles.loader}/>
            );
        }

        const props = {
            appliedJobs,
            navigation,
            refreshJobs,
            jobStatuses
        };

        return activeTab === "active" ? (
            <Active {...props} activeApplications={active}/>
        ) : (
            <InActive {...props} inActiveApplications={inactive}/>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <Text style={styles.headerText}>My Applications</Text>

                {appliedJobs.length === 0 ? (
                    <NoApplicationsOrJobs navigation={navigation} role={role}/>
                ) : (
                    <>
                        <Text style={styles.description}>
                            As the employer is evaluating your qualifications, we may contact you
                            to provide additional information. Thank you for your interest and thank you for
                            using Job Bazaar.
                        </Text>

                        <View style={styles.tabsContainer}>
                            {renderTabButton('active', active, 'Active')}
                            {renderTabButton('inactive', inactive, 'Inactive')}
                        </View>

                        {renderContent()}
                    </>
                )}
            </View>

            <View style={styles.companyInfoContainer}>
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
    contentContainer: {
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
    description: {
        fontSize: 16,
        marginVertical: 24,
    },
    tabsContainer: {
        flexDirection: "row",
        marginVertical: 10,
    },
    tabButtonContainer: {
        flex: 1,
    },
    tabButton: {
        justifyContent: "center",
        alignItems: "center"
    },
    tabButtonText: {
        fontSize: 17,
    },
    activeTabButton: {
        borderBottomWidth: 2.5,
        borderBottomColor: "#0875e1",
        paddingBottom: 10
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    companyInfoContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: "90%"
    }
});

export default DisplayAppliedJobs;