import {StyleSheet, Text, View} from "react-native";
import {useSelector} from "react-redux";
import {RootState} from "@/Types/types";

const Header = () => {
    const userInfo = useSelector((state: RootState) => state.userInfo)
    const role = userInfo.role
    return (
        <View>
            <View style={styles.container}>
                <Text style={styles.text}>Job Title</Text>
                {role === 'Employer' && <Text style={styles.text}>Applicants</Text>}
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopWidth: 0.2,
        borderTopColor: "gray",
        paddingTop: 16,
        marginTop: 10,
        borderBottomWidth: 0.7,
        borderBottomColor: "gray",
        paddingBottom: 20
    },
    text: {
        fontSize: 18
    }
})
export default Header