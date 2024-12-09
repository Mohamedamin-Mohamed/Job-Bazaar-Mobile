import {StyleSheet, Text, View} from "react-native";

const Qualifications = ({qualification}: { qualification?: string }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Basic Qualifications:</Text>
            <Text style={styles.subText}>{qualification}</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        marginVertical: 16
    },
    headerText: {
        fontSize: 18,
        textDecorationLine: "underline",
    },
    subText: {
        fontSize: 16,
        marginTop: 20,
        letterSpacing: 0.5
    }
})
export default Qualifications