import {Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {useState} from "react";

interface AddRoleModalProps {
    type: string;
    handleModalDisplay: () => void;
}

const AddRoleSkillModal = ({type, handleModalDisplay}: AddRoleModalProps) => {
    const [searchText, setSearchText] = useState('');
    const image = require('../Images/empty_self_chat.png');

    return (
            <Modal visible={true} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    {/* Overlay Click */}
                    <TouchableOpacity
                        onPress={handleModalDisplay}
                        style={StyleSheet.absoluteFillObject}
                    />
                    {/* Modal Content */}
                    <View style={styles.modalContent}>
                        <View style={styles.headerView}>
                            <Text style={styles.headerText}>
                                Add {type === 'skills' ? 'skills' : 'roles'}
                            </Text>
                            <Icon name="close" size={30} onPress={handleModalDisplay} />
                        </View>
                        <TouchableOpacity style={styles.search} activeOpacity={0.8}>
                            <Icon name="search" size={24} color="gray" />
                            <TextInput
                                value={searchText}
                                onChangeText={text => setSearchText(text)}
                                placeholder={`Type to search ${type === 'skills' ? 'skills' : 'roles'}`}
                                style={[styles.normalText, {width: '100%'}]}
                            />
                        </TouchableOpacity>
                        <View style={styles.lastView}>
                            <Image source={image} style={styles.image} />
                            <Text style={styles.normalText}>0 suggestion(s)</Text>
                        </View>
                    </View>
                </View>
            </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        width: '90%',
        height: '40%',
        padding: 20,
        borderRadius: 4,
        zIndex: 1, // Ensures it is above the overlay
    },
    image: {
        width: 140,
        height: 140,
    },
    headerView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerText: {
        fontSize: 20,
        fontWeight: '500',
    },
    search: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 4,
        borderColor: 'gray',
        padding: 10,
        marginTop: 20,
        gap: 10,
    },
    normalText: {
        fontSize: 16,
    },
    lastView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        gap: 16,
    },
});

export default AddRoleSkillModal;
