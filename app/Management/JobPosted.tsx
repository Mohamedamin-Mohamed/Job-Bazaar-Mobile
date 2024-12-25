import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Job, RootStackParamList, RootState} from "@/app/Types/types";
import NoApplicationsOrJobs from "@/app/Applications/ApplicationStatus/NoApplicationsOrJobs";
import CompanyInfo from "@/app/Applications/ViewJobDescription/CompanyInfo";
import {useEffect, useState} from "react";
import countJobs from "@/app/countJobsOrApplications/countJobs";
import Active from "@/app/Management/JobStatus/Active";
import InActive from "@/app/Management/JobStatus/InActive";
import {NavigationProp} from "@react-navigation/core";
import {useSelector} from "react-redux";

interface JobPostedProps {
    navigation: NavigationProp<RootStackParamList, 'ManagementHub'>,
    uploadedJobs: Job[],
    refreshJobs: () => void
}

const JobPosted = ({navigation, uploadedJobs, refreshJobs}: JobPostedProps) => {
    const [activeButton, setActiveButton] = useState('active')
    const {active, inactive} = countJobs(uploadedJobs)
    const userInfo = useSelector((state: RootState) => state.userInfo)
    const role = userInfo.role
    const names = {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName
    }

    useEffect(() => {
        return navigation.addListener('focus', () => {
            refreshJobs()
        })

    }, [navigation, refreshJobs]);

    const renderedComponent =
        activeButton === "active" ? (
            <Active uploadedJobs={uploadedJobs} activeApplications={active} navigation={navigation}
                    refreshJobs={refreshJobs}/>
        ) : (
            <InActive uploadedJobs={uploadedJobs} inActiveApplications={inactive} navigation={navigation}/>
        );
    return (
        <View style={styles.container}>
            <Text style={styles.nameText}>Welcome {names.firstName} {names.lastName}</Text>
            <View style={styles.childContainer}>
                <Text style={styles.headerText}>Job Applications Overview</Text>
                {uploadedJobs.length >= 1 ? (
                    <>
                        <Text style={styles.text}>As you evaluate the qualifications of the candidates, we encourage
                            you to reach out if you require additional information. Thank you for utilizing
                            Job Bazaar to find the right talent for your team.</Text>
                        <View style={styles.activityButtons}>
                            <View style={{flex: 1}}>
                                <TouchableOpacity
                                    style={[styles.buttons, activeButton === 'active' && styles.buttonClicked]}
                                    onPress={() => setActiveButton('active')}>
                                    <Text style={styles.buttonsText}>Active ({active})</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 1}}>
                                <TouchableOpacity
                                    style={[styles.buttons, activeButton !== 'active' && styles.buttonClicked]}
                                    onPress={() => setActiveButton('inactive')}>
                                    <Text style={styles.buttonsText}>Inactive ({inactive})</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {renderedComponent}
                    </>
                ) : (
                    <NoApplicationsOrJobs navigation={navigation} role={role}/>
                )}
            </View>
            <View style={{justifyContent: "center", alignItems: "center", width: "90%"}}>
                <CompanyInfo role={role}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    childContainer: {
        width: "90%",
        padding: 24,
        backgroundColor: "white",
        borderColor: "white",
        borderRadius: 4,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold"
    },
    nameText: {
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 20
    },
    text: {
        fontSize: 16,
        marginVertical: 24,
    },
    activityButtons: {
        flexDirection: "row",
        marginVertical: 10,
    },
    buttons: {
        justifyContent: "center",
        alignItems: "center"
    },
    buttonsText: {
        fontSize: 17,
    },
    buttonClicked: {
        borderBottomWidth: 2.5,
        borderBottomColor: "#0875e1",
        paddingBottom: 10
    }

})
export default JobPosted