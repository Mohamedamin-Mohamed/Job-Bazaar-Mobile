import React, {useCallback, useEffect, useState} from "react";
import {Application, RootStackParamList, RootState} from "@/Types/types";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {ActivityIndicator, ScrollView, StyleSheet, View} from "react-native";
import NoTasks from "./NoTasks";
import DisplayAppliedJobs from "./DisplayAppliedJobs";
import getAppliedJobs from "@/app/fetchRequests/getAppliedJobs";
import {useSelector} from "react-redux";

type AppliedJobsProps = NativeStackScreenProps<RootStackParamList, 'AppliedJobs'>

const AppliedJobs: React.FC<AppliedJobsProps> = ({navigation}) => {
    const applicantEmail = useSelector((state: RootState) => state.userInfo.email);
    const [loading, setLoading] = useState(false);
    const [appliedJobs, setAppliedJobs] = useState<Application[]>([]);

    const fetchAppliedJobs = useCallback(async (controller: AbortController) => {
        setLoading(true);

        try {
            const response = await getAppliedJobs(applicantEmail, controller);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const jobs = await response.json();
            setAppliedJobs(jobs);
        } catch (err) {

        } finally {
            setLoading(false);
        }
    }, [applicantEmail]);

    useEffect(() => {
        const controller = new AbortController();

        const fetchJobs = () => {
            fetchAppliedJobs(controller).catch(err => {
                if (!(err instanceof DOMException && err.name === 'AbortError')) {
                    console.error("Error in fetchJobs:", err);
                }
            });
        };

        const unsubscribe = navigation.addListener('focus', fetchJobs);
        fetchJobs();

        return () => {
            unsubscribe();
            controller.abort();
        };
    }, [fetchAppliedJobs]);

    const handleRefresh = useCallback(async () => {
        const controller = new AbortController();
        await fetchAppliedJobs(controller);
        return () => controller.abort();
    }, [fetchAppliedJobs]);

    const renderContent = () => {
        if (loading) {
            return (
                <ActivityIndicator
                    size="large"
                    color="#367c2b"
                    style={styles.activityBar}
                />
            );
        }

        return (
            <View style={styles.contentContainer}>
                <NoTasks/>
                <DisplayAppliedJobs
                    navigation={navigation}
                    appliedJobs={appliedJobs}
                    refreshJobs={handleRefresh}
                />
            </View>
        );
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
        >
            {renderContent()}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    contentContainer: {
        flex: 1,
    },
    activityBar: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default AppliedJobs;