import {RootStackParamList} from "@/app/Types/types";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {StyleSheet, View} from "react-native";
import NoTasks from "@/app/Applications/NoTasks";
import DisplayAppliedJobs from "@/app/Applications/DisplayAppliedJobs";

type AppliedNavigationProp = NativeStackScreenProps<RootStackParamList, 'AppliedJobs'>

const AppliedJobs = ({navigation, route}: AppliedNavigationProp) => {
    const {jobs} = route.params
    return (
        <View>
            <NoTasks/>
            <DisplayAppliedJobs appliedJobs={jobs}/>
        </View>
    )
}
const styles = StyleSheet.create({})
export default AppliedJobs
