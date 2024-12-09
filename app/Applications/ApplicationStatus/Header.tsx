import {StyleSheet, Text, View} from "react-native";

const Header = () => {
    return (
        <View>
            <View style={styles.container}>
                <Text style={styles.text}>Job Title</Text>
                <Text style={styles.text}>Action</Text>
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