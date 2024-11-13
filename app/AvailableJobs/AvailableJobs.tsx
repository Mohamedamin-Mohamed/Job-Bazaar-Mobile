import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "@/app/Types/types";
import {View} from "react-native";

type AvailableJobsNavigationProp = StackNavigationProp<RootStackParamList, 'AvailableJobs'>
const AvailableJobs = ({navigation} : {navigation: AvailableJobsNavigationProp}) => {
    return(
        <View>

        </View>
    )
}
export default AvailableJobs