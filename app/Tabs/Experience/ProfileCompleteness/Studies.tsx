import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useState} from "react";
import AddRoleSkillModal from "@/app/Modals/AddRoleSkillModal";

const Education = () => {
    const [showModal, setShowModal] = useState(false)
    const image = require('../../../Images/resume.png')

    const handleModalDisplay = () => {
        setShowModal(prevState => !prevState)
    }

    return (
        <View>
            <View style={styles.headerView}>
                <Text>Showcase your skills</Text>
                <Image source={image} style={styles.image}/>
            </View>
            <Text>Show what you know to your teammates and managers. Get recommendations to grow.</Text>
            <TouchableOpacity style={styles.uploadView}>
                <Text style={styles.uploadButton}>Add Skills</Text>
            </TouchableOpacity>
            {showModal && <AddRoleSkillModal type="skills" handleModalDisplay={handleModalDisplay}/>}
        </View>
    )
}
const styles = StyleSheet.create({
    image: {
        width: 90,
        height: 90,
        marginLeft: "auto"
    },
    headerView: {
        flexDirection: "row"
    },
    uploadView: {
        width: 140,
        height: 36
    },
    uploadButton: {
        color: "#ffde00"
    }
})
export default Education