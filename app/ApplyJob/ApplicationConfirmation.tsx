import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {RootStackParamList} from "@/app/Types/types";

type ApplicationConfirmationProps = StackScreenProps<RootStackParamList, 'ApplicationConfirmation'>

const ApplicationConfirmation = ({navigation}: ApplicationConfirmationProps) => {
    const img = require('../Images/application_success_1578821919412.png')
    return (
        <View style={styles.container}>
            <View style={styles.childContainer}>
                <Image source={img} style={styles.image}/>
                <View style={styles.headerView}>
                    <Text style={styles.headerText}>Thank you for applying</Text>
                    <Text style={styles.subHeadText}>We have received your application</Text>
                </View>
                <View style={styles.buttonsView}>
                    <TouchableOpacity style={styles.viewButton} onPress={() => navigation.replace('AvailableJobs')}>
                        <Text style={styles.viewButtonText}>View more Jobs</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.viewApplication}
                                      onPress={() => navigation.replace('AppliedJobs')}>
                        <Text style={styles.viewApplicationText}>View application history</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white"
    },
    childContainer: {
        flex: 0.6
    },
    image: {
        width: 360,
        height: 200
    },
    headerView: {
        gap: 10,
        marginVertical: 44
    },
    headerText: {
        color: "#1f2329",
        fontWeight: "500",
        fontSize: 22
    },
    subHeadText: {
        color: "#1f2329",
        fontWeight: "600",
        fontSize: 40
    },
    buttonsView: {
        flexDirection: "row",
        gap: 20,
    },
    viewButton: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#325ab4",
        borderRadius: 6,
        borderWidth: 0.4,
        borderColor: "white",
        width: 145,
        height: 40
    },
    viewButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600"
    },
    viewApplication: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#325ab4",
        width: 200,
        height: 40
    },
    viewApplicationText: {
        color: "#325ab4",
        fontSize: 16,
        fontWeight: "bold"
    }
})
export default ApplicationConfirmation