import React, { useState } from 'react';
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import JobType from "./JobType";

type JobTypeDropDownProps = {
    handleChange: (name: string, value: string) => void;
    jobType: string;
    disabled: boolean;
};

const JobTypeDropDown = ({ handleChange, jobType, disabled }: JobTypeDropDownProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOptionClick = (selectedJobType: string) => {
        setIsOpen(false);
        handleChange("jobType", selectedJobType);
    };

    return (
        <View style={[styles.container, { pointerEvents: disabled ? 'none' : 'auto' }]}>
            <TouchableOpacity
                onPress={() => setIsOpen(!isOpen)}
                style={styles.headerButton}
                accessibilityLabel="Job type selector"
            >
                <Text style={styles.headerText}>
                    {jobType || 'Select Job Type'}
                </Text>
                <Text style={styles.arrow}>{isOpen ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            <Modal visible={isOpen} transparent={true} animationType="slide">
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsOpen(false)}
                >
                    <View style={styles.childContainer}>
                        {JobType.map((type, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleOptionClick(type)}
                                style={styles.optionButton}
                            >
                                <Text style={styles.optionTitle}>{type}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 150,
        height: 40,
        marginTop: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent overlay for better focus
        justifyContent: 'center',
        alignItems: 'center',
    },
    childContainer: {
        width: 204,
        backgroundColor: "white",
        borderRadius: 4,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: Platform.OS === 'android' ? 3 : 0,
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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    headerText: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold",
    },
    arrow: {
        marginLeft: "auto",
    },
    optionButton: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    optionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default JobTypeDropDown;
