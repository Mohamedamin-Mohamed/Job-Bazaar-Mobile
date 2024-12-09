import {StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {Application, RootStackParamList} from "../../Types/types";
import Header from "./Header";
import {useState} from "react";
import ApplicationOptions from "./ApplicationOptions";
import NoApplications from "./NoApplications";
import {NavigationProp} from "@react-navigation/core";

type ActiveProps = {
    navigation: NavigationProp<RootStackParamList, 'AppliedJobs'>,
    appliedJobs: Application[],
    activeApplications: number
}
const Active = ({navigation, appliedJobs, activeApplications}: ActiveProps) => {
    const [clicked, setClicked] = useState<Record<string, boolean>>({})
    const parseDate = (dateString: string) => {
        const [month, day, year] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    // sorting appliedJobs by applicationDate
    const sortedAppliedJobs = [...appliedJobs].sort((a, b) => {
        const dateA = parseDate(a.applicationDate).getTime()
        const dateB = parseDate(b.applicationDate).getTime()
        return dateB - dateA; // sort descending
    });
    const handleClick = (jobId: string) => {
        if (clicked[jobId]) {
            setClicked({[jobId]: false})
            return
        }
        setClicked({[jobId]: true})
    }
    const handleDismiss = (event: any) => {
       if(event.target === event.currentTarget){
           setClicked({})
       }
    }
    return (
        <TouchableWithoutFeedback onPress={handleDismiss}>
            <View>
                {activeApplications > 0 ?
                    <>
                        <Header/>
                        {sortedAppliedJobs.map((application) => (
                            application.isActive === 'true' && (
                                <View key={application.jobId} style={styles.childViews}>
                                    <TouchableOpacity>
                                        <Text style={styles.positionText}>{application.position}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleClick(application.jobId)}>
                                        <Text style={{fontSize: 20}}>...</Text>
                                    </TouchableOpacity>
                                    {clicked[application.jobId] && (
                                        <ApplicationOptions/>
                                    )}
                                </View>
                            )
                        ))}

                    </>
                    : <NoApplications navigation={navigation}/>}
            </View>
        </TouchableWithoutFeedback>
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
        fontSize: 16,
        color: "#0875e1",
    },
})
export default Active