import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Job, RootStackParamList} from "@/app/Types/types";
import {NavigationProp} from "@react-navigation/core";

interface JobOptionsProps {
    navigation: NavigationProp<RootStackParamList, 'ManagementHub'>,
    job: Job,
    handleClickClose: (jobId: string) => void,
    withdrawJob?: (job: Job) => void
}

const JobOptions = ({navigation, job, handleClickClose, withdrawJob}: JobOptionsProps) => {

    const viewDescription = () => {
        handleClickClose(job.jobId)
        navigation.navigate('ViewJobDescription', {job})
    }
    return (
        <View style={[styles.container, job.jobStatus !== 'true' && {left: 180}]}>
            <View style={styles.childContainer}>
                <TouchableOpacity onPress={() => viewDescription()}>
                    <Text style={styles.viewButton}>View Job</Text>
                </TouchableOpacity>
                {job.jobStatus === 'active' &&
                    <TouchableOpacity onPress={() => withdrawJob && withdrawJob(job)}>
                        <Text style={styles.withdrawButton}>Withdraw Job</Text>
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 30,
        marginTop: 10,
        padding: 10,
    },
    childContainer: {
        zIndex: 100,
        backgroundColor: "white",
        borderColor: "grey",
        borderWidth: 0.4,
        borderRadius: 4,
        width: 130,
    },
    viewButton: {
        backgroundColor: "#0875e1",
        color: "white",
        textAlign: "center",
        fontSize: 16,
        marginTop: 8,
        padding: 6,
        fontWeight: "500",
    },
    withdrawButton: {
        padding: 6,
        fontSize: 16,
    }
})
export default JobOptions