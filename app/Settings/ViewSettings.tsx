import {RootStackParamList} from "@/Types/types";
import {Text, View} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {NavigationProp} from "@react-navigation/core";

const ViewSettings = ({navigation}: { navigation: NavigationProp<RootStackParamList, 'Settings'> }) => {
    return (
        <View>
            <Text>Under Construction</Text>
        </View>
    )
}
export default ViewSettings