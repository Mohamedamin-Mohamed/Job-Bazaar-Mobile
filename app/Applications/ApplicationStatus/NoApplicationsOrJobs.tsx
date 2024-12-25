import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {RootStackParamList} from "../../Types/types";
import {NavigationProp} from "@react-navigation/core";

type NoApplicationsOrJobsNavigationProp = NavigationProp<RootStackParamList, 'AppliedJobs'> |
    NavigationProp<RootStackParamList, 'ManagementHub'>

type NoApplicationsOrJobsProps = {
    navigation: NoApplicationsOrJobsNavigationProp,
    role: string
}

const NoApplicationsOrJobs = ({navigation, role}: NoApplicationsOrJobsProps) => {
    const handleNavigation = () => {
        role === 'Applicant' ? navigation.navigate('AvailableJobs') : navigation.navigate('UploadJob')
    }

    return (
        <View style={styles.container}>
            <Image source={require('../../Images/no_application_banner.png')}/>
            <Text style={{fontSize: 16}}>{role === 'Applicant' ? "You have no applications" : "You have no jobs"}</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleNavigation()}>
                <Text style={styles.buttonText}>{role === 'Applicant' ? "Search For Jobs" : "Upload a Job"}</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 4
    },
    button: {
        borderColor: "#367c2b",
        marginTop: 10
    },
    buttonText: {
        color: "#367c2b",
        fontWeight: "bold",
        fontSize: 18,
        borderRadius: 4,
        borderWidth: 1,
        padding: 10,
        marginTop: 4,
        borderColor: "#367c2b"
    }
})

export default NoApplicationsOrJobs