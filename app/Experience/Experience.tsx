import {ScrollView, StyleSheet, View} from "react-native";
import ProfileCompleteness from "@/app/Experience/ProfileCompleteness/ProfileCompleteness";
import Education from "@/app/Experience/Education/Education";
import WorkExperience from "@/app/Experience/Work Experience/WorkExperience";
import {RootStackParamList} from "@/Types/types";
import {StackScreenProps} from "@react-navigation/stack";

type NavigationProp = StackScreenProps<RootStackParamList, 'Experience'>
const Experience = ({navigation}: NavigationProp) => {
    return (
        <ScrollView>
            <View style={styles.container}>
                <ProfileCompleteness/>
                <Education navigation={navigation}/>
                <WorkExperience navigation={navigation}/>
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20,
        gap: 10
    }
})
export default Experience
