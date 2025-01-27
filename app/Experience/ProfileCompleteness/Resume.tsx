import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";

const Resume = () => {
    const image = require('../../Images/resume.png')
    return (
        <View style={styles.container}>
            <View style={styles.headerView}>
                <Text style={styles.headerText}>Complete profile with resume</Text>
                <Image source={image} style={styles.image}/>
            </View>
            <Text style={styles.normalText}>Quickly and easily add your career information in just one simple step to
                enhance your profile.</Text>
            <TouchableOpacity style={styles.uploadView} disabled={true}>
                <Text>Upload Resume</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        borderWidth: 0.2,
        borderRadius: 4,
        borderColor: "gray",
        padding: 10,
    },
    headerView: {
        flexDirection: "row"
    },
    headerText: {
        fontSize: 16,
        fontWeight: "500",
        width: "64%"
    },
    image: {
        width: 64,
        height: 64,
        marginLeft: "auto"
    },
    normalText: {
        fontSize: 14,
        marginVertical: 20
    },
    uploadView: {
        width: 140,
        height: 36,
        borderRadius: 3,
        backgroundColor: "#ffde00",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20
    },
})
export default Resume