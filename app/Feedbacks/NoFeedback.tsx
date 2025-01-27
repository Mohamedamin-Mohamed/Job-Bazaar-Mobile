import {Image, StyleSheet, Text, View} from "react-native";

const NoFeedback = () => {
    const img = require('../Images/empty_self_chat.png')
    return (
        <View style={styles.container}>
            <Image source={img} style={styles.image}/>
            <Text style={[styles.generalText, {fontSize: 20, fontWeight: "bold"}]}>No feedback requests</Text>
            <Text style={[styles.generalText, {paddingVertical: 6}]}>There are no requests</Text>
            <Text style={styles.generalText}>Matching your search criteria</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        marginVertical: 10,
        marginLeft: "9%"
    },
    generalText: {
        color: "#69717f",
        fontSize: 18
    },
    image: {
        width: 140,
        height: 140
    },
})
export default NoFeedback