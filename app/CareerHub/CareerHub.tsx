import {ScrollView, StyleSheet, Text, View} from "react-native";
import Interests from "./Interests";
import {useDispatch, useSelector} from "react-redux";
import {Address, Application, Job, Referral, RootStackParamList, RootState} from "../Types/types";
import Explore from "./Explore";
import Activity from "./Activity";
import {useEffect, useMemo, useState} from "react";
import getAppliedJobs from "../fetchRequests/getAppliedJobs";
import getUploadedJobs from "../fetchRequests/getUploadedJobs";
import getReferrals from "../fetchRequests/getReferrals";
import countApplications from "../countJobsOrApplications/countApplications";
import countJobs from "../countJobsOrApplications/countJobs";
import addressFetcher from "@/app/fetchRequests/addressFetcher";
import * as Location from 'expo-location';
import {setLocationInfo} from "@/app/Redux/locationSlice";
import {StackNavigationProp} from "@react-navigation/stack";
import getJobById from "@/app/fetchRequests/getJobById";


type CareerHubProp = StackNavigationProp<RootStackParamList, 'CareerHub'>
type UserLocation = {
    latitude: number,
    longitude: number
}
const CareerHub = ({navigation}: { navigation: CareerHubProp }) => {
    const [location, setLocation] = useState<UserLocation>({latitude: 0, longitude: 0})
    const [loading, setLoading] = useState(false)
    const user = useSelector((state: RootState) => state.userInfo)
    const {email, role, firstName, lastName} = useSelector((state: RootState) => state.userInfo);
    const abbreviatedName = useMemo(() => `${firstName[0]}${lastName[0]}`, [firstName, lastName]);

    const dispatch = useDispatch()
    const [records, setRecords] = useState<Application[] | Job[]>([])
    const [referrals, setReferrals] = useState<Referral[]>([])
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

            const [jobsOrApplications, referrals] = await Promise.all([
                fetchJobsOrApplications.ok ? fetchJobsOrApplications.json() : [],
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
                } catch (error) {
                    console.error(`Error fetching job status for jobId: ${application.jobId}`, error);
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
            console.error("Error fetching job statuses:", err);
        }
    };


    useEffect(() => {
        const controller = new AbortController();
        fetchAllJobStatuses(controller).catch(err => console.error(err));
        return () => {
            controller.abort();
        };
    }, [records]);

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
        }
    }, [navigation, email, role]);

    useEffect(() => {
        const getLocation = async () => {
            try {
                const {status} = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.error('Permission to access location was denied');
                    return;
                }

                const location = await Location.getCurrentPositionAsync();
                const {latitude, longitude} = location.coords
                setLocation({latitude, longitude});
            } catch (err) {
                console.error(err);
            }
        };

        getLocation().catch(err => console.error(err))
    }, []);


    const fetchAddress = async (controller: AbortController) => {
        try {
            const response = await addressFetcher(location, controller);
            if (!response.ok) {
                console.log(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (!data.address) {
                console.error("Address not found");
            }

            const address: Address = {
                city: data.address.city || data.address.village || data.address.town || data.address.municipality || '',
                state: data.address.state || '',
                country: data.address.country || '',
            };

            dispatch(setLocationInfo(address));
        } catch (err) {
            console.error("Error fetching address:", err);
        }
    };

    useEffect(() => {
        if (location.latitude !== 0 && location.longitude !== 0) {
            const controller = new AbortController();
            fetchAddress(controller).catch(err => console.error(err));
            return () => controller.abort();
        }
    }, [location]);


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