import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {useState} from "react";
import AddRoleSkillModal from "@/app/Modals/AddRoleSkillModal";

const Skills = () => {
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const handleModalDisplay = () => {
        setShowModal(prevState => !prevState)
    }
    return (
        <View style={styles.childContainer}>
            <View style={styles.headerView}>
                <Text style={styles.headerText}>Skills I want</Text>
                <Icon name="add" size={30} color="gray"/>
            </View>
            <View style={styles.middleView}>
                <Icon name="bolt" size={36} color="#367c2b"/>
                <View>
                    <Text style={styles.normalText}>Get course, project, and job recommendations based on your
                        interests</Text>
                    <View style={{marginVertical: 10}}>
                        <TouchableOpacity style={styles.buttonView} onPress={() => handleModalDisplay()}>
                            <Text style={styles.skillsButton}>Add skills</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={{flexDirection: "column"}}>
                <View style={styles.headerView}>
                    <Text style={styles.headerText}>Suggested skills for you</Text>
                    <TouchableOpacity onPress={() => setShowSuggestions(prevState => !prevState)}>
                        {!showSuggestions ? <Icon name="expand-more" size={30} color="gray"/> :
                            <Icon name="expand-less" size={30} color="gray"/>}
                    </TouchableOpacity>
                </View>

                <View style={styles.lastView}>
                    {showSuggestions && (
                        <Text style={styles.suggestionsText}>Suggestions will appear here when available</Text>
                    )}
                </View>
                {showModal &&
                    <AddRoleSkillModal type="skills" handleModalDisplay={handleModalDisplay}/>}
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    childContainer: {
        width: "90%",
        padding: 16,
        borderWidth: 0.4,
        borderRadius: 8,
        borderColor: "gray",
        backgroundColor: "white"
    },
    headerView: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    headerText: {
        fontSize: 20,
        fontWeight: "500"
    },
    middleView: {
        flexDirection: "row",
        gap: 10,
        marginVertical: 36
    },
    normalText: {
        width: "40%",
        fontSize: 16,
        color: "#4f5666",
        lineHeight: 22
    },
    buttonView: {
        width: 92,
        height: 36,
        justifyContent: "center",
    },
    skillsButton: {
        color: "#367c2b",
        fontSize: 17,
        fontWeight: "500",
        backgroundColor: "#e6f0e1",
        padding: 8,
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
    },
    lastView: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 30,
    },
    suggestionsText: {
        fontSize: 14,
        color: "#4f5666",
        fontWeight: "500"
    }
})
export default Skills