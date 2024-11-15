import {Animated, StyleSheet, Text, View} from "react-native";
import Interests from "@/app/CareerHub/Interests";
import {useSelector} from "react-redux";
import {Application, Job, Referral, RootStackParamList, RootState} from "@/app/Types/types";
import Explore from "@/app/CareerHub/Explore";
import {StackNavigationProp} from "@react-navigation/stack";
import Activity from "@/app/CareerHub/Activity";
import {useEffect, useState} from "react";
import getAppliedJobs from "@/app/fetchRequests/getAppliedJobs";
import getUploadedJobs from "@/app/fetchRequests/getUploadedJobs";
import getReferrals from "@/app/fetchRequests/getReferrals";
import countActiveApplications from "@/app/countJobsOrApplications/countActiveApplications";
import countJobs from "@/app/countJobsOrApplications/countJobs";
import ScrollView = Animated.ScrollView;

type CareerHubProp = StackNavigationProp<RootStackParamList, 'CareerHub'>

const CareerHub = ({navigation}: { navigation: CareerHubProp }) => {
    const user = useSelector((state: RootState) => state.userInfo)
    const abbreviatedName = user.firstName.substring(0, 1) + user.lastName.substring(0, 1)

    const email = user.email
    const role = user.role

    const [records, setRecords] = useState<Application[] | Job[]>([])
    const [referrals, setReferrals] = useState<Referral[]>([])
    const [count, setCount] = useState(0)

    const fetchData = async (controller: AbortController) => {
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
            console.error(exp);
        }
    };

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
            fetchData(controller).catch(err => console.error("Focus fetch error:", err));
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
                        <Activity navigation={navigation} records={records} referrals={referrals} count={count}/>
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