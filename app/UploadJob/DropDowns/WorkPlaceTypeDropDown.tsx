import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform, Modal, NativeUIEvent} from 'react-native';
import WorkPlaceTypes from "./WorkPlaceTypes";
import {WorkPlace} from "../../Types/types";

type WorkPlaceTypeDropDownProps = {
    handleChange: (name: string, value: string) => void
    workPlace: string;
    disabled: boolean;
};
const Workplaces: WorkPlace[] = WorkPlaceTypes

const WorkPlaceTypeDropDown = ({handleChange, workPlace, disabled}: WorkPlaceTypeDropDownProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOptionClick = (option: WorkPlace) => {
        setIsOpen(false);
        handleChange("workPlace", option.type);
    }

    return (
        <View style={[styles.container, {pointerEvents: disabled ? 'none' : 'auto'}]}>
            <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.headerButton}>
                <Text style={{textAlign: "center", fontSize: 16, fontWeight: "bold"}}>{workPlace ? workPlace : 'Workplace type?'}</Text>
                <Text style={{marginLeft: "auto"}}>{isOpen ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                transparent={true}
                animationType="slide">
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsOpen(false)}>
                    <View style={[styles.childContainer,
                        {
                            position: 'relative',
                            top: 386,
                            left: 32,
                        }
                    ]}
                    >
                        {Workplaces.map((workplace, index) => (
                            <TouchableOpacity key={index} onPress={() => handleOptionClick(workplace)}
                                              style={styles.optionButton}>
                                <Text style={styles.optionTitle}>{workplace.type}</Text>
                                <Text style={styles.optionDescription}>{workplace.description}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 150,
        height: 40,
        marginTop: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    childContainer: {
        width: 204,
        backgroundColor: "white",
        borderWidth: 1,
        borderRadius: 4,
        borderColor: "white",
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    headerButton: {
        width: 140,
        padding: 10,
        borderWidth: 1,
        borderRadius: 4,
        flexDirection: "row",
        alignItems: "center",
        borderColor: "white",
        backgroundColor: "white",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: Platform.OS === 'android' ? 3 : 0,
    },
    optionButton: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    optionTitle: {
        fontWeight: 'bold',
        marginBottom: 4,
        fontSize: 16
    },
    optionDescription: {
        color: '#666',
        fontSize: 16,
    }
});

export default WorkPlaceTypeDropDown;