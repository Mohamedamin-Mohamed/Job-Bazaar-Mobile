import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList, RootState} from "@/Types/types";
import {ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Location from "@/app/Applications/ViewJobDescription/Location";
import Info from "@/app/Applications/ViewJobDescription/Info";
import JobDescription from "@/app/Applications/ViewJobDescription/JobDescription";
import Qualifications from "@/app/Applications/ViewJobDescription/Qualifications";
import {useSelector} from "react-redux";
import Toast from "react-native-toast-message";

type ViewApplicationProps = NativeStackScreenProps<RootStackParamList, 'ViewJobDescription'>

const ViewJobDescription = ({route, navigation}: ViewApplicationProps) => {
    const {job} = route.params
    const {applicantsPerJob} = route.params
    const userInfo = useSelector((state: RootState) => state.userInfo)
    const role = userInfo.role

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handleDateParsing = (date: string) => {
        const [month, day, year] = date.split('-').map(Number)

        const monthName = month ? monthNames[month - 1] : ''
        return monthName ? `${monthName} ${day}, ${year}` : ''

    }

    const viewJob = () => {
        navigation.navigate('ViewJob', {job})
    }

    const handleNavigation = () => {
        navigation.navigate('ViewApplicants', {job})
    }

    return (
        job ?
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.childContainer}>
                        <Text style={styles.position}>{job.position}</Text>
                        <View>
                            <Text>You uploaded this job on {handleDateParsing(job.postedDate)}</Text>
                            <View style={{flexDirection: "row", gap: 10}}>
                                <TouchableOpacity style={styles.applicationButton}
                                                  onPress={() => viewJob()}>
                                    <Text style={styles.applicationButtonText}>View Job Desc.</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => handleNavigation()}
                                    style={styles.viewApplicants}>
                                    <Text style={styles.viewApplicantsText}>View Applicants</Text>
                                </TouchableOpacity>
                            </View>
                            {job.jobStatus === 'inActive' &&
                                <TouchableOpacity style={styles.inActiveApp}>
                                    <Text style={styles.inActiveAppText}>Job Withdrawn</Text>
                                </TouchableOpacity>
                            }
                            <Location job={job}
                                      postedDate={job.postedDate}
                                      {...(role === 'Employer' && {applicantsPerJob})}
                                      role={role}/>
                            <Info/>
                            <JobDescription description={job.description}/>
                            <Qualifications qualification={job.requirements}/>
                        </View>
                    </View>
                    <Toast/>
                </View>
            </ScrollView> :
            <ActivityIndicator style={styles.scrollContent} size="large" color="#367c2b"/>
    )
}
const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },
    childContainer: {
        width: "92%",
        backgroundColor: "white",
        borderWidth: 1,
        borderRadius: 4,
        borderColor: "white",
        padding: 30,
        marginVertical: 20
    },
    position: {
        fontSize: 18,
        marginBottom: 20,
        fontWeight: "bold",
    },
    applicationButton: {
        backgroundColor: "#e6f0e1",
        width: 150,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        marginVertical: 10,
    },
    applicationButtonText: {
        color: "#367c2b",
        fontSize: 16,
    },
    viewApplicants: {
        backgroundColor: "#e6f0e1",
        width: 150,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        marginVertical: 10,
    },
    viewApplicantsText: {
        color: "#367c2b",
        fontSize: 16
    },
    inActiveApp: {
        backgroundColor: "#ffefee",
        alignSelf: "flex-start",
        height: 40,
        borderRadius: 4,
        justifyContent: "center",
        padding: 10
    },
    inActiveAppText: {
        color: "#a31b12",
        fontSize: 16
    }
});

export default ViewJobDescription