import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {NavigationProp} from "@react-navigation/core";
import {Application, RootStackParamList} from "@/Types/types";

interface ApplicationOptionsProps {
    navigation: NavigationProp<RootStackParamList, 'AppliedJobs'>,
    application: Application,
    handleClickClose: (jobId: string) => void,
    withdrawApp: (application: Application) => void
}

const ApplicationOptions = ({navigation, application, handleClickClose, withdrawApp}: ApplicationOptionsProps) => {
    const viewDescription = () => {
        //what the below line does is it closes the application options component
        handleClickClose(application.jobId)
        navigation.navigate('ViewApplicationDescription', {application})
    }
    return (
        <View style={[styles.container, application.isActive !== 'true' && {left: 180}]}>
            <View style={styles.childContainer}>
                <TouchableOpacity onPress={() => viewDescription()}>
                    <Text style={styles.viewButton}>View Application</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 30,
        marginTop: 10
    },
    childContainer: {
        zIndex: 100,
        backgroundColor: "white",
        borderColor: "grey",
        borderWidth: 0.4,
        borderRadius: 4,
    },
    viewButton: {
        backgroundColor: "#0875e1",
        color: "white",
        textAlign: "center",
        fontSize: 16,
        marginTop: 8,
        padding: 6,
        fontWeight: "500"
    },
    withdrawButton: {
        padding: 6,
        fontSize: 16,
    }
})
export default ApplicationOptions