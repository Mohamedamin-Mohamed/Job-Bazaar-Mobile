import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useState} from "react";
import getAvailableJobs from "../fetchRequests/getAvailableJobs";
import {Job, RootStackParamList, RootState} from "../Types/types";
import {useSelector} from "react-redux";
import {NavigationProp} from "@react-navigation/core";

type CareerHubProp = NavigationProp<RootStackParamList, 'CareerHub'>

const Explore = ({navigation}: { navigation: CareerHubProp }) => {
    const [loading, setLoading] = useState(false)
    const role = useSelector((state: RootState) => state.userInfo.role)
    const [recentJob, setRecentJob] = useState<Job>()

    const parseDate = (date: string) => {
        const [month, day, year] = date.split('-').map(Number)
        return new Date(year, month - 1, day)
    }
    const sortAvailableJobs = (jobs: Job[]) => {
        return jobs.sort((a, b) => {
            const datePostedA = parseDate(a.postedDate).getTime()
            const datePostedB = parseDate(b.postedDate).getTime()

            return datePostedB - datePostedA
        })
    }
    const fetchRecentJob = async (controller: AbortController) => {
        setLoading(true)
        try {
            const response = await getAvailableJobs(controller)
            if (response.ok) {
                const jobs: Job[] = await response.json()
                const sortedAvailableJobs = sortAvailableJobs(jobs as Job[])
                setRecentJob(sortedAvailableJobs[0])
            }
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        const controller = new AbortController()
        const unsubscribe = navigation.addListener('focus', () => {
            fetchRecentJob(controller).catch(err => console.error(err))
        })
        return () => {
            unsubscribe()
            controller.abort()
        }
    }, [])

    const handleExplore = (role: string) => {
        if (role === 'Employer') {
            navigation.navigate('UploadedJobs')
        } else {
            navigation.navigate('AvailableJobs')
        }
    }
    return (
        loading ? <ActivityIndicator size="large" color="#367c2b"/> :
            <View style={styles.container}>
                <View style={styles.childContainer}>
                    <Text style={styles.headerText}>Get more from Career Hub</Text>
                    <View style={{marginVertical: 20, gap: 6}}>
                        <Text style={{fontSize: 17, color: "#5c5500", fontWeight: "bold"}}>Jobs</Text>
                        <Text style={{
                            fontSize: 17,
                            color: "#5c5500",
                            fontWeight: "bold"
                        }}>{role === 'Applicant' ? "Browse opportunities for you or friends" : "Find top talent for your team."}</Text>
                    </View>
                    <View style={{gap: 6}}>
                        <Text style={{fontSize: 17, color: "#5c5500", fontWeight: "bold"}}>Uploaded recently</Text>
                        <Text style={{fontSize: 17, color: "#5c5500", fontWeight: "bold"}}>{recentJob?.position}</Text>
                        <View style={{justifyContent: "center", alignItems: "center"}}>
                            <TouchableOpacity style={styles.jobButton} onPress={() => handleExplore(role)}>
                                <Text style={{
                                    color: "white",
                                    fontSize: 18
                                }}>{role === 'Employer' ? "Uploaded Jobs" : "Explore Jobs"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
    )
}
const styles = StyleSheet.create({
    activityIndicator: {
        flex: 1,
        backgroundColor: "gray",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "stretch",
        color: "black"
    },
    childContainer: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 24,
        borderColor: "white",
        backgroundColor: "white",
    },
    headerText: {
        fontSize: 22,
    },
    jobButton: {
        width: 250,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        backgroundColor: "#367c2b",
        borderColor: "#367c2cb",
        marginTop: 16,
    }
})
export default Explore