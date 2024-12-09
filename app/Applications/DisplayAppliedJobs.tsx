import {Application, RootStackParamList} from "../Types/types";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useState} from "react";
import countApplications from "../countJobsOrApplications/countApplications";
import Active from "./ApplicationStatus/Active";
import InActive from "./ApplicationStatus/InActive";
import {NavigationProp} from "@react-navigation/core";
import NoApplications from "@/app/Applications/ApplicationStatus/NoApplications";
import CompanyInfo from "@/app/Applications/ViewJobDescription/CompanyInfo";

type DisplayAppliedJobsProps = {
    navigation: NavigationProp<RootStackParamList, 'AppliedJobs'>,
    appliedJobs: Application[],
    refreshJobs: () => void
}

const DisplayAppliedJobs = ({navigation, appliedJobs, refreshJobs}: DisplayAppliedJobsProps) => {
    const [activeButton, setActiveButton] = useState('active')
    const {active, inactive} = countApplications(appliedJobs)

    useEffect(() => {
        return navigation.addListener('focus', () => {
            refreshJobs()
        })

    }, [navigation, refreshJobs]);

    const renderedComponent =
        activeButton === "active" ? (
            <Active
                appliedJobs={appliedJobs}
                activeApplications={active}
                navigation={navigation}
                refreshJobs={refreshJobs}
            />
        ) : (
            <InActive
                appliedJobs={appliedJobs}
                inActiveApplications={inactive}
                navigation={navigation}
            />
        );

    return (
        <View style={styles.container}>
            <View style={styles.childContainer}>
                <Text style={styles.headerText}>My Applications</Text>

                {appliedJobs.length > 1 ? (
                    <>
                        <Text style={styles.text}>As the employer is evaluating your qualifications, we may contact you
                            to
                            provide additional information. Thank you for your interest and thank you for
                            using Job Bazaar.</Text>
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
                    <NoApplications navigation={navigation}/>
                )}
            </View>
            <View style={{justifyContent: "center", alignItems: "center", width: "90%"}}>
                <CompanyInfo/>
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
export default DisplayAppliedJobs