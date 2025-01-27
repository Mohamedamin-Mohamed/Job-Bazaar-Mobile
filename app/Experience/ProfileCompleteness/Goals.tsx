import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useState} from "react";
import AddRoleSkillModal from "@/app/Modals/AddRoleSkillModal";

const Goals = () => {
    const [showModal, setShowModal] = useState(false)
    const image = require('../../../Images/goals.png')

    const handleModalDisplay = () => {
        setShowModal(prevState => !prevState)
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerView}>
                <Text style={styles.headerText}>Establish your goals</Text>
                <Image source={image} style={styles.image}/>
            </View>
            <Text style={styles.normalText}>Get recommendations based on what you want to learn and which jobs you want
                in the future.</Text>
            <TouchableOpacity style={styles.uploadView} disabled={true}>
                <Text>Add Goals</Text>
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
        fontSize: 16,
        fontWeight: "500",
        width: "60%"
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
export default Goals