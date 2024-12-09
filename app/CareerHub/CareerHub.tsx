import {ScrollView, StyleSheet, Text, View} from "react-native";
import Interests from "./Interests";
import {useSelector} from "react-redux";
import {Application, Job, Referral, RootStackParamList, RootState} from "../Types/types";
import Explore from "./Explore";
import Activity from "./Activity";
import {useEffect, useState} from "react";
import getAppliedJobs from "../fetchRequests/getAppliedJobs";
import getUploadedJobs from "../fetchRequests/getUploadedJobs";
import getReferrals from "../fetchRequests/getReferrals";
import countActiveApplications from "../countJobsOrApplications/countActiveApplications";
import countJobs from "../countJobsOrApplications/countJobs";
import {NavigationProp} from "@react-navigation/core";

type CareerHubProp = NavigationProp<RootStackParamList, 'CareerHub'>

const CareerHub = ({navigation}: { navigation: CareerHubProp }) => {
    const [loading, setLoading] = useState(false)
    const user = useSelector((state: RootState) => state.userInfo)
    const abbreviatedName = user.firstName.substring(0, 1) + user.lastName.substring(0, 1)

    const email = user.email
    const role = user.role
    const [records, setRecords] = useState<Application[] | Job[]>([])
    const [referrals, setReferrals] = useState<Referral[]>([])
    const [count, setCount] = useState(0)

    const fetchData = async (controller: AbortController) => {
        setLoading(true)
        try {
            const fetchJobsOrApplications = role === 'Applicant'
                ? await getAppliedJobs(email, controller)
                : await getUploadedJobs(email, controller);

            const referralsResponse = role === 'Applicant' ? await getReferrals(email, controller) : null;

            const [jobsOrApplications, referrals] = await Promise.all([
                fetchJobsOrApplications.json(),
                referralsResponse?.ok ? await referralsResponse.json() : []
            ]);

            setRecords(jobsOrApplications);
            setReferrals(referrals);

        } catch (exp) {
            console.error('Error is ', exp);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (role === 'Applicant') {
            setCount(countActiveApplications(records as Application[]));
        } else {
            setCount(countJobs(records as Job[]));
        }
    }, [records, role]);

    useEffect(() => {
        const controller = new AbortController();
        const unsubscribe = navigation.addListener('focus', () => {
            fetchData(controller).catch(err => {
                if (err.name !== 'AbortError') {
                    console.error("Focus fetch error:", err);
                }
            });

        });

        return () => {
            unsubscribe();
            controller.abort();
        };
    }, [navigation, email, role]);


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
                            <Text style={{color: "#757575", fontSize: 14, fontWeight: "bold"}}>Welcome to your
                                Career
                                Hub</Text>
                        </View>
                    </View>
                    <View style={{gap: 24, width: "100%"}}>
                        <Interests navigation={navigation}/>
                        <Explore navigation={navigation}/>
                        <Activity navigation={navigation} records={records} referrals={referrals}
                                  count={count} loading={loading}/>
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
        display: 'flex',
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