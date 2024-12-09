import {Application, RootStackParamList} from "../Types/types";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useState} from "react";
import countActiveApplications from "../countJobsOrApplications/countActiveApplications";
import countInactiveApplications from "../countJobsOrApplications/countInactiveApplications";
import Active from "./ApplicationStatus/Active";
import InActive from "./ApplicationStatus/InActive";
import {StackNavigationProp} from "@react-navigation/stack";
import {NavigationProp} from "@react-navigation/core";

type DisplayAppliedJobsProps = {
    navigation: NavigationProp<RootStackParamList, 'AppliedJobs'>,
    appliedJobs: Application[]
}

const DisplayAppliedJobs = ({navigation, appliedJobs}: DisplayAppliedJobsProps) => {
    const [activeButton, setActiveButton] = useState('active')
    const activeApplications = countActiveApplications(appliedJobs)
    const inActiveApplications = countInactiveApplications(appliedJobs)
    return (
        <View style={styles.container}>
            <View style={styles.childContainer}>
                <Text style={styles.headerText}>My Applications</Text>
                <Text style={styles.text}>As the employer is evaluating your qualifications, we may contact you to
                    provide additional information. Thank you for your interest and thank you for
                    using Job Bazaar.</Text>
                <View style={styles.activityButtons}>
                    <View style={{flex: 1}}>
                        <TouchableOpacity style={[styles.buttons, activeButton === 'active' && styles.buttonClicked]} onPress={()=> setActiveButton('active')}>
                            <Text style={styles.buttonsText}>Active ({activeApplications})</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1}}>
                        <TouchableOpacity style={[styles.buttons, activeButton !== 'active' && styles.buttonClicked]} onPress={()=> setActiveButton('inactive')}>
                            <Text style={styles.buttonsText}>Inactive ({inActiveApplications})</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {activeButton === 'active' ? <Active appliedJobs={appliedJobs} activeApplications={activeApplications} navigation={navigation} /> :
                    <InActive appliedJobs={appliedJobs} inActiveApplications={inActiveApplications} navigation={navigation} />}
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