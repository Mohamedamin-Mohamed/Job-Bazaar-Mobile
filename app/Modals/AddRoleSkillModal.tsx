import {Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface AddRoleModalProps {
    type: string,
    showModal: boolean,
    handleModalDisplay: () => void
}

const AddRoleModal = ({type, showModal, handleModalDisplay}: AddRoleModalProps) => {
    const image = require('../Images/empty_self_chat.png')
    return (
        <View>
            <Modal visible={showModal} animationType="slide" transparent={true}>
                <TouchableOpacity onPress={handleModalDisplay}>
                    <View>
                        <Text>Add {type === 'skill' ? "skills" : "roles"}</Text>
                        <Icon name="close" size={24} color="gray"/>
                    </View>
                    <TouchableOpacity>
                        <Icon name="search" size={24} color="gray"/>
                        <TextInput placeholder="Type to search skills"/>
                    </TouchableOpacity>
                    <View>
                        <Image source={image} style={styles.image}/>
                        <Text>0 suggestions(s)</Text>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    )
}
const styles = StyleSheet.create({
    image: {
        width: 140,
        height: 140
    }
})
export default AddRoleModal