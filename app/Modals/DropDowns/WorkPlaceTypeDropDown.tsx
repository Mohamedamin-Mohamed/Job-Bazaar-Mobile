import React, {useRef, useState} from 'react';
import {LayoutRectangle, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import WorkPlaceTypes from "./WorkPlaceTypes";
import {WorkPlace} from "@/Types/types";

type WorkPlaceTypeDropDownProps = {
    handleChange: (name: string, value: string) => void;
    workPlace: string;
    disabled: boolean;
};
const Workplaces: WorkPlace[] = WorkPlaceTypes;

const WorkPlaceTypeDropDown = ({handleChange, workPlace, disabled}: WorkPlaceTypeDropDownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState<LayoutRectangle | null>(null);
    const touchableRef = useRef<React.ElementRef<typeof TouchableOpacity>>(null);

    const handleOptionClick = (option: WorkPlace) => {
        setIsOpen(false);
        handleChange("workPlace", option.type);
    };

    const openDropdown = () => {
        touchableRef.current?.measure((_fx, _fy, width, height, px, py) => {
            setDropdownPosition({
                x: px,
                y: py + height,
                width,
                height,
            });
        });
        setIsOpen(prevState => !prevState);
    };

    return (
        <View style={[styles.container, {pointerEvents: disabled ? 'none' : 'auto'}]}>
            <TouchableOpacity
                ref={touchableRef}
                onPress={openDropdown}
                style={styles.headerButton}>
                <Text style={styles.headerText}>{workPlace ? workPlace : 'Workplace type?'}
                </Text>
                <Text style={{marginLeft: "auto"}}>{isOpen ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {isOpen && dropdownPosition && (
                <Modal visible={isOpen} transparent={true} animationType="slide">
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setIsOpen(false)}>
                        <View
                            style={[
                                styles.childContainer,
                                {
                                    position: "absolute",
                                    top: dropdownPosition.y + 6,
                                    left: dropdownPosition.x,
                                    width: dropdownPosition.width + 36,
                                }]}>
                            {Workplaces.map((workplace, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleOptionClick(workplace)}
                                    style={styles.optionButton}>
                                    <Text style={styles.optionTitle}>{workplace.type}</Text>
                                    <Text style={styles.optionDescription}>{workplace.description}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}
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
        fontSize: 16,
        fontWeight: "600",
    },
    optionButton: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    optionTitle: {
        fontWeight: '600',
        marginBottom: 4,
        fontSize: 16,
    },
    optionDescription: {
        color: '#666',
        fontSize: 16,
    },
});

export default WorkPlaceTypeDropDown;
