import React, { useCallback, useEffect, useMemo, useState } from "react";
import Toast from "react-native-toast-message";
import { Job, RootStackParamList, RootState } from "@/Types/types";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import NoJobs from "../404s/NoJobs";
import { StackNavigationProp } from "@react-navigation/stack";
import getAvailableJobs from "../fetchRequests/getAvailableJobs";
import DisplayAvailableJobs from "./DisplayAvailableJobs";

type AvailableJobsNavigationProp = StackNavigationProp<RootStackParamList, 'AvailableJobs'>

interface Props {
    navigation: AvailableJobsNavigationProp;
}

const AvailableJobs: React.FC<Props> = ({ navigation }) => {
    const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);

    const { role } = useSelector((state: RootState) => state.userInfo);

    const fetchAvailableJobs = useCallback(async (controller: AbortController) => {
        setLoading(true);
        try {
            const response = await getAvailableJobs(controller);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jobs: Job[] = await response.json();
            setAvailableJobs(jobs);
        } catch (err) {
            if (!(err instanceof DOMException && err.name === 'AbortError')) {
                console.error("Error fetching available jobs:", err);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        const fetchJobs = () => {
            fetchAvailableJobs(controller).catch(err => {
                if (!(err instanceof DOMException && err.name === 'AbortError')) {
                    console.error("Error in fetchJobs:", err);
                }
            });
        };

        const unsubscribe = navigation.addListener('focus', fetchJobs);

        // Initial fetch
        fetchJobs();

        return () => {
            unsubscribe();
            controller.abort();
        };
    }, [navigation, fetchAvailableJobs]);

    const hasActiveJobs = useMemo(() =>
            availableJobs.some(job => job.jobStatus === "active"),
        [availableJobs]
    );

    const renderContent = () => {
        if (loading) {
            return <ActivityIndicator size="large" />;
        }

        return hasActiveJobs ? (
            <DisplayAvailableJobs
                availableJobs={availableJobs}
                navigation={navigation}
            />
        ) : (
            <NoJobs
                role={role}
                navigation={navigation}
            />
        );
    };

    return (
        <View style={styles.container}>
            {renderContent()}
            <Toast />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 2.5,
        justifyContent: "center",
        alignItems: "center",
    }
});

export default AvailableJobs;