import {RootStackParamList} from "../Types/types";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {ScrollView, StyleSheet, View} from "react-native";
import NoTasks from "./NoTasks";
import DisplayAppliedJobs from "./DisplayAppliedJobs";

type AppliedJobsNavigationProp = NativeStackScreenProps<RootStackParamList, 'AppliedJobs'>

const AppliedJobs = ({navigation, route}: AppliedJobsNavigationProp) => {
    const {jobs} = route.params
    return (
        <ScrollView>
            <View>
                <NoTasks/>
                <DisplayAppliedJobs navigation={navigation} appliedJobs={jobs}/>
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({})
export default AppliedJobs
