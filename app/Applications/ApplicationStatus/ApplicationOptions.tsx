import {Text, View,StyleSheet} from "react-native";

const ApplicationOptions = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.viewButton}>View Application</Text>
            <Text style={styles.withdrawButton}>Withdraw Application</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 150,
        top: 30,
        backgroundColor: "white",
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 4,
    },
    viewButton: {
        backgroundColor: "#0875e1",
        color: "white",
        textAlign: "center",
        marginTop: 8,
        padding: 6,
        fontWeight: "bold",
    },
    withdrawButton: {
        padding: 6,
    }
})
export default ApplicationOptions