import React, {useRef, useState} from 'react';
import {LayoutRectangle, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import JobType from "./JobType";

type JobTypeDropDownProps = {
    handleChange: (name: string, value: string) => void;
    jobType: string;
    disabled: boolean;
};

const JobTypeDropDown = ({handleChange, jobType, disabled}: JobTypeDropDownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropDownPosition, setDropDownPosition] = useState<LayoutRectangle | null>(null)
    const touchableRef = useRef<React.ElementRef<typeof TouchableOpacity>>(null)

    const handleOptionClick = (selectedJobType: string) => {
        setIsOpen(false);
        handleChange("jobType", selectedJobType);
    };

    const openDropDown = () => {
        touchableRef.current?.measure((_fx, _fy, width, height, px, py) => {
            setDropDownPosition({
                x: px,
                y: py + height,
                width,
                height
            })
        })
        setIsOpen(prevState => !prevState)
    }
    return (
        <View style={[styles.container, {pointerEvents: disabled ? 'none' : 'auto'}]}>
            <TouchableOpacity
                ref={touchableRef}
                onPress={openDropDown}
                style={styles.headerButton}>
                <Text style={styles.headerText}>
                    {jobType || 'Select Job Type'}
                </Text>
                <Text style={styles.arrow}>{isOpen ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {isOpen && dropDownPosition &&
                <Modal visible={isOpen} transparent={true} animationType="slide">
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setIsOpen(false)}>
                        <View style={[styles.childContainer, {
                            position: "absolute",
                            top: dropDownPosition.y + 6,
                            left: dropDownPosition.x,
                            width: dropDownPosition.width + 36
                        }]}>
                            {JobType.map((jobType, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleOptionClick(jobType)}
                                    style={styles.optionButton}>
                                    <Text style={styles.optionTitle}>{jobType}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </TouchableOpacity>
                </Modal>
            }
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
        flex: 1
    },
    childContainer: {
        backgroundColor: "white",
        borderRadius: 4,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    headerButton: {
        width: 140,
        padding: 10,
        borderWidth: 0.4,
        borderRadius: 4,
        flexDirection: "row",
        alignItems: "center",
        borderColor: "gray",
        backgroundColor: "white",
    },
    headerText: {
        textAlign: "center",
        fontSize: 14,
        padding: 1,
        fontWeight: "600",
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
