import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "@/Types/types";

type UploadedJobsNavigationProp = StackNavigationProp<RootStackParamList, 'UploadedJobs'>
type AvailableJobsNavigationProp = StackNavigationProp<RootStackParamList, 'AvailableJobs'>
type ManagementHubNavigationProp = StackNavigationProp<RootStackParamList, 'ManagementHub'>

type NavigationPropUnion = UploadedJobsNavigationProp | AvailableJobsNavigationProp | ManagementHubNavigationProp

const NoJobs = ({role, navigation}: { role: string, navigation: NavigationPropUnion }) => {
    const handleNavigation = () => {
        if (role === 'Applicant') {
            navigation.navigate('CareerHub')
        } else {
            navigation.navigate('UploadJob')
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.childContainer}>
                <Image source={require('../Images/404_illustration.png')} style={styles.image}/>
                <Text
                    style={[styles.texts, {fontSize: 24}]}>{role === 'Employer' ? "No Uploaded Jobs" : "No Available Jobs"}</Text>
                <Text
                    style={styles.texts}>{role === 'Applicant' ? "Sorry, there are no available jobs yet" : "Sorry, you have no active or uploaded jobs.."}</Text>
            </View>
            <View style={styles.parentButtons}>
                <TouchableOpacity style={{width: "64%"}} onPress={() => handleNavigation()}>
                    <Text
                        style={styles.uploadJob}>{role === 'Applicant' ? "Home" : "Upload Job"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        height: 460,
        flexDirection: "column",
        justifyContent: "flex-start",
    },
    childContainer: {
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    image: {
        width: 127,
        height: 196,
        marginBottom: 48
    },
    texts: {
        color: "#4f5666",
        fontWeight: "bold",
        fontSize: 16,
        padding: 4
    },
    parentButtons: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 20,
    },
    supportButton: {
        width: 150,
        height: 36,
        borderWidth: 1,
        borderColor: "#2575a7",
        borderRadius: 2,
        backgroundColor: "#ffffff",
        fontWeight: "bold",
        textAlign: "center",
        color: "#2575a7",
        fontSize: 16,
        padding: 7
    },
    uploadJob: {
        backgroundColor: "#2575a7",
        height: 36,
        color: "white",
        textAlign: "center",
        fontSize: 16,
        padding: 7,
        fontWeight: "bold",
        borderRadius: 2,
    }
})
export default NoJobs