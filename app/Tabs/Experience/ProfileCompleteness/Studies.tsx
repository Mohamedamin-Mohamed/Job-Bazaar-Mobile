import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useState} from "react";
import AddRoleSkillModal from "@/app/Modals/AddRoleSkillModal";

const Studies = () => {
    const [showModal, setShowModal] = useState(false)
    const image = require('../../../Images/education.png')

    const handleModalDisplay = () => {
        setShowModal(prevState => !prevState)
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerView}>
                <Text style={styles.headerText}>Show what you’ve learned</Text>
                <Image source={image} style={styles.image}/>
            </View>
            <Text style={styles.normalText}>Enter your school, major and degree so your teammates get to know more about you.</Text>
            <TouchableOpacity style={styles.uploadView}>
                <Text style={styles.uploadButton}>Add Education</Text>
            </TouchableOpacity>
            {showModal && <AddRoleSkillModal type="skills" handleModalDisplay={handleModalDisplay}/>}
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
        fontSize: 18,
        fontWeight: "500",
        width: "60%"
    },
    image: {
        width: 64,
        height: 64,
        marginLeft: "auto"
    },
    normalText: {
        fontSize: 16,
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
export default Studies