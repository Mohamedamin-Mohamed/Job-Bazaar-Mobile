import {ActivityIndicator, ScrollView, StyleSheet, View} from "react-native";
import getUploadedJobs from "@/app/FetchRequests/getUploadedJobs";
import {useSelector} from "react-redux";
import {Job, RootStackParamList, RootState} from "@/Types/types";
import {useEffect, useState} from "react";
import JobPosted from "@/app/Management/JobPosted";
import {StackScreenProps} from "@react-navigation/stack";
import Toast from "react-native-toast-message";

type ManagementHubNavigationProp = StackScreenProps<RootStackParamList, 'ManagementHub'>

const ManagementHub = ({navigation}: ManagementHubNavigationProp) => {
    const userInfo = useSelector((state: RootState) => state.userInfo)
    const employerEmail = userInfo.email
    const [uploadedJobs, setUploadedJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)

    const fetchUploadedJobs = async () => {
        setLoading(true);
        try {
            const response = await getUploadedJobs(employerEmail, new AbortController());
            if (response.ok) {
                const jobs = await response.json();
                setUploadedJobs(jobs);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUploadedJobs().catch(err => console.error(err));
    }, []);

    return (
        <View style={styles.container}>
            <Toast/>
            {loading ?
                <ActivityIndicator size="large" color="#367c2b" style={styles.activityBar}/>
                :
                <ScrollView>
                    <JobPosted
                        navigation={navigation}
                        uploadedJobs={uploadedJobs}
                        refreshJobs={fetchUploadedJobs}
                    />
                </ScrollView>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    activityBar: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    container: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    }
});

export default ManagementHub;
