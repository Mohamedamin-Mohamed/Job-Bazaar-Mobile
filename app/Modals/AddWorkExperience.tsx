import {Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {CheckBox} from "@rneui/themed";
import Buttons from "@/app/FixedButtons/Buttons";
import {useState} from "react";
import {RootState, WorkExpCreation, WorkExperience} from "@/Types/types";
import {useSelector} from "react-redux";
import {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {addMonths, format} from "date-fns";
import EndDatePicker from "@/app/Modals/DatePickers/EndDatePicker";
import StartDatePicker from "@/app/Modals/DatePickers/StartDatePicker";
import Toast from "react-native-toast-message";
import saveWorkExperience from "@/app/FetchRequests/saveWorkExperience";

interface AddWorkExperienceProps {
    handleModalDisplay: () => void,
    workExperience: WorkExperience | null,
    handleWorkExperience: () => void
}

const AddWorkExperience = ({handleModalDisplay, workExperience, handleWorkExperience}: AddWorkExperienceProps) => {
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const applicantEmail = useSelector((state: RootState) => state.userInfo).email;

    const parseDate = (date: string) => {
        const [month, year] = date.split('-').map(Number)
        return new Date(year, month - 1)
    }
    const initialWorkExpDetails = {
        email: applicantEmail,
        title: workExperience?.title || '',
        company: workExperience?.company || '',
        location: workExperience?.location || '',
        startDate: workExperience?.startDate ? parseDate(workExperience.startDate) : addMonths(new Date(), -48),
        endDate: workExperience?.endDate ? parseDate(workExperience.endDate) : new Date(),
    }

    const [workExpDetails, setWorkExpDetails] = useState<WorkExpCreation>(initialWorkExpDetails);

    const dates = {
        startDate: workExpDetails.startDate,
        endDate: workExpDetails.endDate
    }

    const getFormattedDate = (date: Date) => {
        return format(date, 'MM-yyy')
    }

    const handleButtons = (type: string) => {
        switch (type) {
            case 'clear': {
                handleClear()
                break
            }
            case 'cancel': {
                handleModalDisplay()
                break
            }
            case 'save': {
                handleSave().catch(err => console.error(err))
                break
            }
        }
    }

    const checkIfAllFieldsUpdated = () => {
        const keys = Object.keys(initialWorkExpDetails) as (keyof WorkExpCreation)[]
        for (const key of keys) {
            if (initialWorkExpDetails[key] !== workExpDetails[key]) {
                return true
            }
        }
    }

    const handleClear = () => {
        const updated = checkIfAllFieldsUpdated()
        if (!updated) {
            Toast.show({
                type: "info",
                text1: 'No fields to be cleared',
                onShow: () => setDisabled(true),
                onHide: () => setDisabled(false)
            })
        } else {
            handleWorkExperience()
            setWorkExpDetails({
                email: applicantEmail,
                title: '',
                company: '',
                location: '',
                startDate: addMonths(new Date(), -48),
                endDate: new Date(),
            });
            setChecked(prevState => !prevState)
        }
    }

    const handleSave = async () => {

        const allFieldFilled = Object.values(workExpDetails).every(val => val !== '')
        if (!allFieldFilled) {
            Toast.show({
                type: 'error',
                text1: 'Please fill out all the required fields*',
                onShow: () => setDisabled(true),
                onHide: () => setDisabled(false)
            })
            return
        }

        const workExpRequest = {
            ...workExpDetails,
            startDate: getFormattedDate(workExpDetails.startDate),
            endDate: getFormattedDate(workExpDetails.endDate)
        }
        try {
            setLoading(true)
            const response = await saveWorkExperience(workExpRequest)
            const text = await response.text()
            if (response.ok) {
                Toast.show({
                    type: 'success',
                    text1: text,
                    onShow: () => setDisabled(true),
                    onHide: () => {
                        setDisabled(false)
                        setWorkExpDetails(initialWorkExpDetails)
                        handleModalDisplay()
                    }
                })
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (name: string, value: string) => {
        setWorkExpDetails((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleStartDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowStartPicker(false);
        if (selectedDate) {
            setWorkExpDetails(prevState => ({
                ...prevState, ["startDate"]: selectedDate
            }))
        }
    }

    const handleEndDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowEndPicker(false);
        if (selectedDate) {
            setWorkExpDetails(prevState => ({
                ...prevState, ["endDate"]: selectedDate
            }))
        }
    };

    return (
        <Modal visible={true} transparent={true} animationType="slide">
            <View style={styles.modalOverlay}>
                <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={handleModalDisplay}/>
                <View style={styles.modalContent}>
                    <View style={styles.headerView}>
                        <Text style={styles.headerText}>Add Work</Text>
                        <Icon name="close" size={30} color="gray" onPress={handleModalDisplay}/>
                    </View>
                    <Text style={styles.textAuto}>* Required fields</Text>
                    <ScrollView>
                        <View style={styles.subHeadView}>
                            <Text style={styles.headerText}>Title*</Text>
                            <View style={[styles.inputsView, styles.iconView]}>
                                <TextInput
                                    editable={!disabled}
                                    value={workExpDetails.title}
                                    style={styles.inputs}
                                    placeholder="Senior UX Designer"
                                    onChangeText={(text) => handleChange('title', text)}
                                />
                                {workExpDetails.title && (
                                    <Icon name="close" size={15} onPress={() => handleChange('title', '')}/>
                                )}
                            </View>
                        </View>
                        <View style={styles.subHeadView}>
                            <Text style={styles.headerText}>Company*</Text>
                            <View style={[styles.inputsView, styles.iconView]}>
                                <TextInput
                                    editable={!disabled}
                                    value={workExpDetails.company}
                                    style={styles.inputs}
                                    placeholder="Ex. Amazon"
                                    onChangeText={(text) => handleChange('company', text)}
                                />
                                {workExpDetails.company && (
                                    <Icon name="close" size={15} onPress={() => handleChange('company', '')}/>
                                )}
                            </View>
                        </View>
                        <View style={styles.subHeadView}>
                            <Text style={styles.headerText}>Location*</Text>
                            <View style={[styles.inputsView, styles.iconView]}>
                                <TextInput
                                    editable={!disabled}
                                    value={workExpDetails.location}
                                    style={styles.inputs}
                                    placeholder="Ex.Mountain View, CA"
                                    onChangeText={(text) => handleChange('location', text)}
                                />
                                {workExpDetails.location && (
                                    <Icon name="close" size={15} onPress={() => handleChange('location', '')}/>
                                )}
                            </View>
                        </View>

                        <TouchableOpacity onPress={() => setShowStartPicker(false)}>
                            <View style={styles.subHeadView}>
                                <Text style={styles.headerText}>Start Date*</Text>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={[styles.inputsView, {flexDirection: "row", justifyContent: "space-between"}]}
                                    onPress={() => setShowStartPicker(true)}>
                                    <Text
                                        style={styles.inputs}>{getFormattedDate(workExpDetails.startDate) || "Start Date (MM/YYYY)"}</Text>
                                    {workExpDetails.startDate &&
                                        <Icon name="close" size={15} onPress={() => setWorkExpDetails(prevState => ({
                                            ...prevState, ["startDate"]: addMonths(new Date(), -48)
                                        }))}/>}
                                </TouchableOpacity>
                                {showStartPicker && (
                                    <StartDatePicker
                                        handleStartDateChange={handleStartDateChange}
                                        dates={dates}
                                        disabled={disabled}
                                    />
                                )}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setShowEndPicker(false)}>
                            <View style={styles.subHeadView}>
                                <Text style={styles.headerText}>End Date*</Text>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[styles.inputsView, {flexDirection: "row", justifyContent: "space-between"}]}
                                    onPress={() => setShowEndPicker(true)}>
                                    <Text
                                        style={styles.inputs}>{getFormattedDate(workExpDetails.endDate) || "End Date (MM/YYYY)"}</Text>
                                    {workExpDetails.startDate &&
                                        <Icon name="close" size={15} onPress={() => setWorkExpDetails(prevState => ({
                                            ...prevState, ["startDate"]: new Date()
                                        }))}/>}
                                </TouchableOpacity>
                                {showEndPicker && !checked && (
                                    <EndDatePicker
                                        handleEndDateChange={handleEndDateChange}
                                        dates={dates}
                                        disabled={disabled}
                                    />
                                )}
                            </View>
                        </TouchableOpacity>

                        <View style={styles.lastView}>
                            <CheckBox title={"I currently work here"} checked={checked}
                                      onPress={() => setChecked(!checked)} textStyle={styles.wrapperStyle}>
                            </CheckBox>
                        </View>
                    </ScrollView>
                    <Buttons disabled={disabled} handleButtons={handleButtons} loading={loading}/>
                    <Toast/>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 4,
        padding: 20,
        width: "90%",
        maxHeight: "80%",
        marginTop: 38
    },
    headerView: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10
    },
    headerText: {
        fontSize: 17,
        fontWeight: "500"
    },
    textAuto: {
        marginLeft: "auto"
    },
    subHeadView: {
        marginVertical: 7
    },
    iconView: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    inputsView: {
        borderRadius: 4,
        borderWidth: 0.4,
        padding: 10,
        marginTop: 10,
        fontSize: 15,
        width: "96%"
    },
    inputs: {
        width: "96%"
    },
    lastView: {
        flexDirection: "row",
        marginLeft: 0,
        alignItems: "center"
    },
    textArea: {
        height: 150
    },
    checkboxText: {
        fontSize: 16
    },
    wrapperStyle: {
        fontSize: 16,
        color: "black",

    }
});

export default AddWorkExperience;
