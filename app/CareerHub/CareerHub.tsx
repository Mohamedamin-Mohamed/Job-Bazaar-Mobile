import {ScrollView, StyleSheet, Text, View} from "react-native";
import Interests from "./Interests";
import {useSelector} from "react-redux";
import {Application, Feedback, Job, Referral, RootStackParamList, RootState} from "@/Types/types";
import Explore from "./Explore";
import Activity from "./Activity";
import {useEffect, useMemo, useState} from "react";
import getAppliedJobs from "../fetchRequests/getAppliedJobs";
import getUploadedJobs from "../fetchRequests/getUploadedJobs";
import getReferrals from "../fetchRequests/getReferrals";
import countApplications from "../countJobsOrApplications/countApplications";
import countJobs from "../countJobsOrApplications/countJobs";
import {StackNavigationProp} from "@react-navigation/stack";
import getJobById from "@/app/fetchRequests/getJobById";
import getFeedbacks from "@/app/fetchRequests/getFeedbacks";


type CareerHubProp = StackNavigationProp<RootStackParamList, 'CareerHub'>

const CareerHub = ({navigation}: { navigation: CareerHubProp }) => {
    const [loading, setLoading] = useState(false)
    const user = useSelector((state: RootState) => state.userInfo)
    const {email, role, firstName, lastName} = useSelector((state: RootState) => state.userInfo);
    const abbreviatedName = useMemo(() => `${firstName[0]}${lastName[0]}`, [firstName, lastName]);

    const [records, setRecords] = useState<Application[] | Job[]>([])
    const [referrals, setReferrals] = useState<Referral[]>([])
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
    const [jobStatuses, setJobStatuses] = useState<Record<string, string>>({});
    const [count, setCount] = useState(0)

    const fetchData = async (controller: AbortController) => {
        setLoading(true)
        try {
            const isApplicant = role === 'Applicant';

            const fetchJobsOrApplications = isApplicant
                ? await getAppliedJobs(email, controller)
                : await getUploadedJobs(email, controller);

            const referralsResponse = isApplicant ? await getReferrals(email, controller) : null;
            const feedbackResponse = isApplicant ? await getFeedbacks(email, controller) : null

            const [jobsOrApplications, referrals, feedbacks] = await Promise.all([
                fetchJobsOrApplications.ok ? fetchJobsOrApplications.json() : [],
                referralsResponse?.ok ? await referralsResponse.json() : [],
                feedbackResponse?.ok ? await feedbackResponse.json() : []
            ]);

            setRecords(jobsOrApplications);
            setReferrals(referrals);
            setFeedbacks(feedbacks)

        } catch (err: any) {

        } finally {
            setLoading(false)
        }
    }

    const fetchAllJobStatuses = async (controller: AbortController) => {
        const statuses: Record<string, string> = {};

        try {
            const promises = (records as Application[]).map(async (application) => {
                try {
                    const response = await getJobById(application.employerEmail, application.jobId, controller);
                    if (response.ok) {
                        const data: Job = await response.json();
                        return {jobId: application.jobId, status: data.jobStatus};
                    }
                } catch (err) {
                    if (!(err instanceof DOMException && err.name === 'AbortError')) {
                        console.error(`Error fetching job status for jobId: ${application.jobId}`, err);
                    }
                }
                return null;
            });

            const results = await Promise.all(promises);

            results.forEach((result) => {
                if (result) {
                    statuses[result.jobId] = result.status;
                }
            });

            setJobStatuses(statuses);
        } catch (err) {
        }
    };


    useEffect(() => {
        const controller = new AbortController();
        fetchAllJobStatuses(controller).catch(err => console.error(err));
        return () => {
            controller.abort();
        };
    }, []);

    useEffect(() => {
        if (role === 'Applicant') {
            const {active} = countApplications(records as Application[], jobStatuses)
            setCount(active);
        } else {
            const {active} = countJobs(records as Job[])
            setCount(active)
        }
    }, [records, role]);

    useEffect(() => {
        const controller = new AbortController();

        const fetchDataOnFocus = async () => {
            try {
                await fetchData(controller);
            } catch (err) {
                if (!(err instanceof DOMException && err.name === "AbortError")) {
                    console.error("Error in fetchDataOnFocus:", err);
                }
            }
        };

        const unsubscribe = navigation.addListener('focus', fetchDataOnFocus);
        fetchDataOnFocus().catch(console.error);

        return () => {
            unsubscribe();
            controller.abort();
        };
    }, []);

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.childContainer}>
                    <View style={styles.nameParent}>
                        <View style={styles.abbrevNameParent}>
                            <Text style={styles.abbrevName}>{abbreviatedName}</Text>
                        </View>
                        <View style={{justifyContent: "center", marginLeft: 20}}>
                            <Text style={{fontSize: 22, fontWeight: "bold"}}>Hi {user.firstName}</Text>
                            <Text style={{color: "#757575", fontSize: 14, fontWeight: "bold"}}>
                                Welcome to your Career Hub
                            </Text>
                        </View>
                    </View>
                    <View style={{gap: 24, width: "100%"}}>
                        {role === 'Applicant' && <Interests navigation={navigation}/>}
                        <Explore navigation={navigation}/>
                        <Activity
                            navigation={navigation}
                            records={records}
                            referrals={referrals}
                            feedbacks={feedbacks}
                            count={count}
                            loading={loading}
                        />
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        flexDirection: "column",
        color: "black"
    },
    childContainer: {
        flex: 0.68,
        borderWidth: 1,
        borderRadius: 12,
        padding: 24,
        borderColor: "white",
    },
    nameParent: {
        flexDirection: "row",
        marginBottom: 30
    },
    abbrevNameParent: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#367c2b',
        alignItems: 'center',
        justifyContent: 'center'
    },
    abbrevName: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
})
export default CareerHub