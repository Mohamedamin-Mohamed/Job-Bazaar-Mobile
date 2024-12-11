import {StyleSheet, View} from "react-native";
import ProfileCompleteness from "@/app/Tabs/Experience/ProfileCompleteness/ProfileCompleteness";

const Experience = () => {
    return (
        <View style={styles.container}>
            <ProfileCompleteness/>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20
    }
})
export default Experience
