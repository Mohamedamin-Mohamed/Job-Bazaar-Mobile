import { Job } from "@/app/Types/types";
import { StyleSheet, Text, View } from "react-native";
import { differenceInDays, parse } from "date-fns";
import Icon from "react-native-vector-icons/MaterialIcons";

interface LocationProps {
    job: Job;
    postedDate: string;
}

const Location = ({ job, postedDate }: LocationProps) => {
    const appliedDate = parse(postedDate, 'MM-dd-yyyy', new Date());
    const currDate = new Date();

    const daysDifference = differenceInDays(currDate, appliedDate);
    const datePosted = `Posted ${daysDifference > 0 ? (daysDifference + ` Day${daysDifference !== 1 ? "s" : ""} ago`) : "less than a day ago"}`;

    return (
        <View style={styles.container}>
            <View style={styles.column}>
                <View style={[styles.iconView, {width: "70%"}]}>
                    <Icon name="location-on" size={24} color="gray" style={{justifyContent: "flex-start"}} />
                    <Text style={styles.subText}>{job?.location}</Text>
                </View>
            </View>
            <View style={[styles.column, {gap: 10}]}>
                <View style={styles.iconView}>
                    <Icon name="work" size={24} color="gray" />
                    <Text style={styles.subText}>{job?.jobType}</Text>
                </View>
                <View style={styles.iconView}>
                    <Icon name="access-time" size={24} color="gray" />
                    <Text style={styles.subText}>{datePosted}</Text>
                </View>
                <View style={styles.iconView}>
                    <Icon name="assignment" size={24} color="gray" />
                    <Text style={styles.subText}>{job?.jobId}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginVertical: 16,
        paddingTop: 20,
        borderColor: "grey",
        borderTopWidth: 0.2,
        justifyContent: 'space-between',
    },
    subText: {
        fontSize: 16,
    },
    iconView: {
        flexDirection: "row",
        gap: 10,
        alignItems: 'center'
    },
    column: {
        flex: 1,
        gap: 6,
    }
});

export default Location;
