import {ActivityIndicator, ScrollView, StyleSheet, Text, View} from "react-native";
import {Education, RootStackParamList, RootState, WorkExperience} from "@/Types/types";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {useEffect, useState} from "react";
import getEducation from "@/app/FetchRequests/getEducation";
import getWorkExperience from "@/app/FetchRequests/getWorkExperience";
import {useSelector} from "react-redux";
import daysFromAppliedDate from "@/app/Utilities/daysFromAppliedDate";
import Icon from "react-native-vector-icons/MaterialIcons";

const ViewApplication = ({route}: NativeStackScreenProps<RootStackParamList, 'ViewApplication'>) => {
    const {application} = route.params
    const [education, setEducation] = useState<Education | null>(null)
    const [workExperience, setWorkExperience] = useState<WorkExperience | null>(null)
    const [loading, setLoading] = useState(false)
    const applicantEmail = useSelector((state: RootState) => state.userInfo.email)

    const fetchEducationWorkExp = async (controller: AbortController) => {
        setLoading(true)
        try {
            try {
                const educationResponse = await getEducation(applicantEmail, controller)
                if (educationResponse.ok) {
                    const educationData = await educationResponse.json()
                    setEducation(educationData)
                }
            } catch (err) {

            }

            try {
                const workExperienceResponse = await getWorkExperience(applicantEmail, controller);
                if (workExperienceResponse.ok) {
                    const workExperienceData = await workExperienceResponse.json()
                    setWorkExperience(workExperienceData)
                }
            } catch (err) {

            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        const controller = new AbortController()
        fetchEducationWorkExp(controller).catch(err => console.error(err))
        return () => {
            controller.abort()
        };
    }, []);

    return (
        !loading ?
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <View style={styles.container}>
                    <View style={styles.childContainer}>
                        <Text style={styles.headerText}>{application.jobId} {application.position} - Submitted
                            Application</Text>
                        <Text style={styles.subText}>{daysFromAppliedDate(application.applicationDate)}</Text>
                        <View>
                            <Text style={styles.headerText}>My Information</Text>
                            <View style={{gap: 6}}>
                                <Text style={styles.verticalSpacing}>Legal Name</Text>
                                <Text style={styles.subText}>{application.firstName} {application.lastName}</Text>
                                <Text style={styles.verticalSpacing}>Address</Text>
                                <Text style={styles.subText}>{application.city} {application.postalCode}</Text>
                                <Text style={styles.subText}>{application.country}</Text>
                                <Text style={styles.verticalSpacing}>Email</Text>
                                <Text style={styles.subText}>{application.applicantEmail}</Text>
                            </View>
                        </View>
                        {workExperience && (
                            <View>
                                <Text style={styles.headerText}>Work Experience</Text>
                                <View style={{gap: 6}}>
                                    <Text style={styles.verticalSpacing}>Job Title</Text>
                                    <Text style={styles.subText}>{workExperience.title}</Text>
                                    <Text style={styles.verticalSpacing}>Company</Text>
                                    <Text style={styles.subText}>{workExperience.company}</Text>
                                    <Text style={styles.verticalSpacing}>Location</Text>
                                    <Text style={styles.subText}>{workExperience.location}</Text>
                                    <Text style={styles.verticalSpacing}>From</Text>
                                    <Text style={styles.subText}>{workExperience.startDate}</Text>
                                    <Text style={styles.verticalSpacing}>To</Text>
                                    <Text style={styles.subText}>{workExperience.endDate}</Text>
                                </View>
                            </View>
                        )}
                        {education && (
                            <View>
                                <Text style={styles.headerText}>Education</Text>
                                <View style={{gap: 6}}>
                                    <Text style={styles.verticalSpacing}>School or University</Text>
                                    <Text>{education.school}</Text>
                                    <Text style={styles.verticalSpacing}>Degree</Text>
                                    <Text>{education.degree}</Text>
                                </View>
                            </View>
                        )}
                        <Text style={styles.headerText}>Resume/Cv</Text>
                        <View style={{flexDirection: "row", gap: 12}}>
                            <Icon name="insert-drive-file" size={36} color="gray"/>
                            <Text style={[styles.verticalSpacing, {marginTop: 10}]}>{application.resumeName}</Text>
                        </View>
                        <View style={styles.nameBrand}>
                            <Text>© {new Date().getFullYear()} Job Bazaar, Inc. All rights reserved.</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
            : <ActivityIndicator style={styles.container} size="large" color="#367c2b"/>
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
    }
})
export default ViewApplication