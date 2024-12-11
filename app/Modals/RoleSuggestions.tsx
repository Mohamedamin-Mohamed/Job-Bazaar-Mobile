import {Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const RoleSuggestions = ({handleModalDisplay}: {handleModalDisplay: ()=> void}) => {
    return (
            <Modal transparent={true} visible={true}>
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={handleModalDisplay}/>
                    <View style={styles.modalContent}>
                        <View style={styles.headerView}>
                            <Text style={styles.headerText}>Role based suggestions</Text>
                            <Icon name="close" size={26} style={{marginLeft: "auto"}} onPress={handleModalDisplay}/>
                        </View>
                        <Text style={styles.normalText}>Suggestions that will help you get the skill you're interested in.</Text>
                        <Text style={styles.suggestionsText}>0 suggestions(s)</Text>
                    </View>
                </View>
            </Modal>

    )
}
const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        backgroundColor: "white",
        width: "90%",
        height: "24%",
        borderRadius: 4,
        padding: 26
    },
    headerView: {
        flexDirection: "row"
    },
    headerText: {
        fontSize: 20,
        fontWeight: '500',
    },
    normalText: {
        color: "#4f5666",
        fontSize: 18,
        marginVertical: 20
    },
    suggestionsText: {
        fontSize: 16,
        fontWeight: "500"
    }
})
export default RoleSuggestions