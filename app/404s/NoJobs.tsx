import {Image, Linking, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../Types/types";

type UploadedJobsNavigationProp = StackNavigationProp<RootStackParamList, 'UploadedJobs'>
type AvailableJobsNavigationProp = StackNavigationProp<RootStackParamList, 'AvailableJobs'>
type NavigationPropUnion = UploadedJobsNavigationProp | AvailableJobsNavigationProp

const NoJobs = ({role, navigation}: { role: string, navigation: NavigationPropUnion }) => {
    const handleNavigation = () => {
        if (role === 'Applicant') {
            navigation.navigate('CareerHub')
        } else {
            navigation.navigate('UploadJob')
        }
    }

    const handleSupport = async () => {
        const subject = encodeURIComponent('Assistance Needed Regarding Job Uploads');
        const mailtoUrl = `mailto:mohaa204080@gmail.com?subject=${subject}`;

        try {
            const supported = await Linking.canOpenURL(mailtoUrl);
            if (supported) {
                await Linking.openURL(mailtoUrl);
            } else {
                console.error('Failed to open URL: ', mailtoUrl);
            }
        } catch (err) {
            console.error('Error opening email client: ', err);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.childContainer}>
                <Image source={require('../Images/404_illustration.png')} style={styles.image}/>
                <Text style={[styles.texts, {fontSize: 24}]}>No Uploaded jobs</Text>
                <Text
                    style={styles.texts}>{role === 'Applicant' ? "Sorry, there are no available jobs yet" : "Sorry, No jobs uploaded or active."}</Text>
            </View>
            <View style={styles.parentButtons}>
                <TouchableOpacity onPress={() => handleSupport()}>
                    <Text style={styles.supportButton}>Contact Support</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNavigation()}>
                    <Text
                        style={role === 'Employer' ? styles.uploadJob : {}}>{role === 'Applicant' ? "Home" : "Upload Job"}</Text>
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
        width: 150,
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