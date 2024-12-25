import {ScrollView, StyleSheet, View} from "react-native";
import ProfileCompleteness from "@/app/Tabs/Experience/ProfileCompleteness/ProfileCompleteness";
import Education from "@/app/Tabs/Experience/Education/Education";
import WorkExperience from "@/app/Tabs/Experience/Work Experience/WorkExperience";
import {RootStackParamList, RootTabParamList} from "@/app/Types/types";
import Contact from "@/app/Tabs/Experience/Contact";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";

type NavigationProp = BottomTabScreenProps<RootTabParamList, 'Experience'>
const Experience = ({route, navigation}: NavigationProp) => {
    return (
        <ScrollView>
            <View style={styles.container}>
                <ProfileCompleteness/>
                <Education navigation={navigation} route={route}/>
                <WorkExperience navigation={navigation} route={route}/>
                <Contact/>
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
