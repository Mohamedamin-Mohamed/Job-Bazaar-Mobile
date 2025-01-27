import {ScrollView, StyleSheet, Text, View} from "react-native";
import {RootStackParamList, RootState} from "@/Types/types";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {useSelector} from "react-redux";
import daysFromUploadedDate from "@/app/Utilities/daysFromUploadedDate";

const ViewJob = ({route}: NativeStackScreenProps<RootStackParamList, 'ViewJob'>) => {
    const {job} = route.params;
    const userInfo = useSelector((state: RootState) => state.userInfo);

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View style={styles.container}>
                <View style={styles.childContainer}>
                    <Text style={styles.headerText}>
                        {job.jobId} {job.position} - Uploaded Job
                    </Text>
                    <View style={{gap: 3}}>
                        <Text style={styles.subText}>{daysFromUploadedDate(job.postedDate)}</Text>
                    </View>
                    <View>
                        <Text style={styles.headerText}>My Information</Text>
                        <View style={{gap: 6}}>
                            <Text style={styles.verticalSpacing}>Legal Name</Text>
                            <Text style={styles.subText}>
                                {userInfo.firstName} {userInfo.lastName}
                            </Text>
                            <Text style={styles.verticalSpacing}>Email</Text>
                            <Text style={styles.subText}>{job.employerEmail}</Text>
                        </View>
                    </View>

                    <View>
                        <Text style={styles.headerText}>Job Description</Text>
                        <View style={{gap: 6}}>
                            <Text style={styles.verticalSpacing}>Position</Text>
                            <Text>{job.position}</Text>
                            <Text style={styles.verticalSpacing}>Job Id</Text>
                            <Text>{job.jobId}</Text>
                            <Text style={styles.verticalSpacing}>Company</Text>
                            <Text>{job.company}</Text>
                            <Text style={styles.verticalSpacing}>Location</Text>
                            <Text>{job.location}</Text>
                            <Text style={styles.verticalSpacing}>Function</Text>
                            <Text>{job.jobFunction}</Text>
                            <Text style={styles.verticalSpacing}>Job Type</Text>
                            <Text>{job.jobType}</Text>
                            <Text style={styles.verticalSpacing}>Work Place</Text>
                            <Text>{job.workPlace}</Text>
                            <Text style={styles.verticalSpacing}>Description</Text>
                            <Text style={styles.normalText}>{job.description}</Text>
                            <Text style={styles.verticalSpacing}>Requirements</Text>
                            <Text style={styles.normalText}>{job.requirements}</Text>
                        </View>
                    </View>
                    <View style={styles.nameBrand}>
                        <Text>© {new Date().getFullYear()} Job Bazaar, Inc. All rights reserved.</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    childContainer: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: 4,
        borderColor: "white",
        padding: 24
    },
    headerText: {
        fontSize: 16,
        fontWeight: "bold",
        marginVertical: 20
    },
    subText: {
        color: "#4a4a4a",
        fontSize: 16
    },
    verticalSpacing: {
        marginTop: 10,
        fontSize: 18
    },
    nameBrand: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 24
    },
    normalText: {
        fontSize: 16,
        letterSpacing: 0.1
    }
})
export default ViewJob