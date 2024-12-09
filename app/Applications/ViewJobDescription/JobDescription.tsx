import {StyleSheet, Text, View} from "react-native"

const JobDescription = ({description}: { description?: string }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Job Description</Text>
            <Text style={styles.subText}>What you'll do:</Text>
            <View>
                <Text style={{fontSize: 16, letterSpacing: 0.5}}>{description}</Text>
            </View>
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
        marginTop: 20
    }
})
export default JobDescription