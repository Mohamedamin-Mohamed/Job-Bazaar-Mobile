import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Application, RootStackParamList, RootState} from "@/Types/types";
import Header from "./Header";
import {useState} from "react";
import ApplicationOptions from "./ApplicationOptions";
import NoApplications from "./NoApplicationsOrJobs";
import {NavigationProp} from "@react-navigation/core";
import {useSelector} from "react-redux";
import updateApplication from "@/app/fetchRequests/updateApplication";
import React from "react";

type InActiveProps = {
    navigation: NavigationProp<RootStackParamList, 'AppliedJobs'>,
    appliedJobs: Application[],
    inActiveApplications: number,
    jobStatuses: Record<string, string>,
}
const InActive = ({navigation, appliedJobs, inActiveApplications, jobStatuses}: InActiveProps) => {
    const role = useSelector((state: RootState) => state.userInfo).role

    const parseDate = (dateString: string) => {
        const [month, day, year] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    // sorts appliedJobs by applicationDate
    const sortedAppliedJobs = [...appliedJobs].sort((a, b) => {
        const dateA = parseDate(a.applicationDate).getTime()
        const dateB = parseDate(b.applicationDate).getTime()
        return dateB - dateA; // sort descending
    })

    const viewDescription = (application: Application) => {
        navigation.navigate('ViewApplicationDescription', {application: application})
    }

    return (
        <View>
            {inActiveApplications > 0 ?
                <>
                    <Header/>
                    {sortedAppliedJobs.map((application) => (
                        (application.isActive === 'false' || jobStatuses[application.jobId] === 'inActive') && (
                            <View key={application.jobId} style={styles.childViews}>
                                <TouchableOpacity onPress={() => viewDescription(application)}>
                                    <Text style={styles.positionText}>{application.position}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    ))}
                </>
                : <NoApplications navigation={navigation} role={role}/>}
        </View>
    )
}
const styles = StyleSheet.create({
    childViews: {
        marginVertical: 12,
        borderBottomWidth: 0.2,
        borderBottomColor: "gray",
        paddingBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    positionText: {
        fontSize: 18,
        color: "#0875e1",
        marginTop: 4
    },
})
export default InActive