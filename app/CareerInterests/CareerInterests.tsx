import {ScrollView, StyleSheet, View} from "react-native"
import Skills from "@/app/CareerInterests/Skill/Skills";
import Roles from "@/app/CareerInterests/Role/Roles";
import RoleBased from "@/app/CareerInterests/Role/RoleBased";

const CareerInterests = () => {
    return (
        <ScrollView>
            <View style={styles.container}>
                <Skills/>
                <Roles/>
                <RoleBased/>
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 24,
        gap: 20
    },
})
export default CareerInterests