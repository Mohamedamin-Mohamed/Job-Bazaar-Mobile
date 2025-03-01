import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from "react-native"
import {useSelector} from "react-redux";
import {Application, Feedback, Job, Referral, RootState} from "@/Types/types";
import {NavigationProp} from "@react-navigation/core";
import React from "react";

type ActivityNavigationProp = NavigationProp<any>

interface ActivityProps {
    navigation: ActivityNavigationProp,
    records: Application[] | Job[],
    referrals: Referral[],
    feedbacks: Feedback[]
    count: number,
    loading: boolean
}

const Activity = ({navigation, records, referrals, feedbacks, count, loading}: ActivityProps) => {
    const user = useSelector((state: RootState) => state.userInfo)
    const role = user.role

    const handleReferrals = () => {
        navigation.navigate('MyReferrals')
    }

    const referNavigation = () => {
        navigation.navigate('Refer')
    }

    const handleNavigation = () => {
        if (role === 'Employer') {
            navigation.navigate('UploadedJobs')
        } else {
            navigation.navigate('AppliedJobs')
        }
    }

    const handleFeedbacks = () => {
        navigation.navigate('Feedbacks')
    }

    const uploadJob = () => {
        navigation.navigate('UploadJob')
    }
    return (
        loading ? <ActivityIndicator size="large" color="#367c2b"/> :
            records && referrals && (
                <View style={styles.container}>
                    <View style={styles.childContainer}>
                        <Text style={styles.headerText}>My Activity</Text>
                        <View>
                            <TouchableOpacity style={{flexDirection: "row", alignItems: "center"}}
                                              onPress={() => handleNavigation()}>
                                <Text style={[styles.text, {flex: 1, marginTop: 20}]}>
                                    {role === 'Applicant' ? "Job Applications" : "Jobs Uploaded"}</Text>
                                <Text style={[styles.countText]}>{count}</Text>
                            </TouchableOpacity>
                            {role === 'Applicant' &&
                                <>
                                    <TouchableOpacity
                                        style={styles.buttons}
                                        onPress={() => handleReferrals()}>
                                        <Text style={[styles.text, {flex: 1, marginTop: 20}]}>Referrals</Text>
                                        <Text style={styles.countText}>{referrals.length}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.buttons}
                                        onPress={() => handleFeedbacks()}>
                                        <Text style={[styles.text, {flex: 1}]}>Feedbacks</Text>
                                        <Text style={styles.countText}>{feedbacks.length}</Text>
                                    </TouchableOpacity>
                                    <View style={styles.referView}>
                                        <TouchableOpacity onPress={() => referNavigation()}>
                                            <Text style={styles.referButton}>Refer a friend</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            }
                            {role === 'Employer' &&
                                <>
                                    <View style={[styles.referView, {marginTop: 24}]}>
                                        <TouchableOpacity style={styles.uploadJobButton} onPress={() => uploadJob()}>
                                            <Text style={styles.referButton}>Upload a Job</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            }
                        </View>
                    </View>
                </View>
            )
    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "stretch",
        color: "black"
    },
    childContainer: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 24,
        borderColor: "white",
        backgroundColor: "white",
    },
    headerText: {
        fontSize: 22,
    },
    jobButton: {
        width: 250,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        backgroundColor: "#367c2b",
        borderColor: "#367c2cb",
        marginTop: 16,
    },
    text: {
        color: "#367c2b",
        fontWeight: "bold",
        fontSize: 18,
    },
    countText: {
        alignSelf: "flex-end",
        color: "#367c2b",
        fontSize: 22,
        fontWeight: "bold",
        backgroundColor: '#cfd9cc',
        paddingHorizontal: 4
    },
    referView: {
        justifyContent: "center",
        alignItems: "center",
        borderTopWidth: 0.4,
        borderTopColor: "gray",
        paddingTop: 20
    },
    referButton: {
        color: "#367c2b",
        fontWeight: "bold",
        fontSize: 18
    },
    buttons: {
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 20
    },
    uploadJobButton: {}
})
export default Activity