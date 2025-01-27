import {
    Alert,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {useRef, useState} from "react";

import {JobDetails, RootStackParamList, RootState} from "@/Types/types";

import {StackNavigationProp} from "@react-navigation/stack";
import Toast from "react-native-toast-message";
import {format} from "date-fns";
import {useSelector} from "react-redux";
import uploadJob from "@/app/FetchRequests/uploadJob";
import {usePreventRemove} from "@react-navigation/native";
import WorkPlaceTypeDropDown from "@/app/Modals/DropDowns/WorkPlaceTypeDropDown";
import JobTypeDropDown from "@/app/Modals/DropDowns/JobTypeDropDown";

type UploadJobNavigationProp = StackNavigationProp<RootStackParamList, 'UploadJob'>

const UploadJob = ({navigation}: { navigation: UploadJobNavigationProp }) => {
    const uploadJobCompletedRef = useRef(false)
    const userInfo = useSelector((state: RootState) => state.userInfo)
    const [disabled, setDisabled] = useState(false)
    const initialJobDetails: JobDetails = {
        position: '',
        company: '',
        workPlace: '',
        location: '',
        jobFunction: '',
        jobType: '',
        description: '',
        requirements: '',
    }
    const [jobDetails, setJobDetails] = useState<JobDetails>(initialJobDetails)

    const handleChange = (name: string, value: string) => {
        setJobDetails(prevState => ({
            ...prevState, [name]: value
        }))
    }
    const handleButtons = (type: string) => {
        switch (type) {
            case 'clear': {
                handleClear()
                break
            }
            case 'cancel': {
                navigation.goBack()
                break
            }
            case 'save': {
                handleSave().catch(err => console.error(err))
                break
            }

        }
    }
    const checkIfAllFieldsUpdated = () => {
        const keys = Object.keys(initialJobDetails) as (keyof JobDetails)[]
        for (const key of keys) {
            if (initialJobDetails[key] !== jobDetails[key]) {
                return true
            }
        }
        return false
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
            setJobDetails(initialJobDetails)
        }
    }
    const handleSave = async () => {
        const hasNoMissingValues = Object.values(jobDetails).every(value => value !== '')
        if (!hasNoMissingValues) {
            Toast.show({
                type: 'error',
                text1: 'Please fill out all the required fields',
                onShow: () => setDisabled(true),
                onHide: () => setDisabled(false)
            })
            return
        }
        const date = new Date().toISOString()
        const formattedDate = format(date, 'MM-dd-yyy')
        const requestBody = {
            ...jobDetails, employerEmail: userInfo.email, postedDate: formattedDate, jobStatus: 'active'
        }
        const response = await uploadJob(requestBody, new AbortController())
        const text = await response.text()

        // Set the ref before showing toast by marking upload job as completed
        uploadJobCompletedRef.current = true;
        if (response.ok) {
            Toast.show({
                type: 'success',
                text1: text,
                onShow: () => setDisabled(true),
                onHide: () => {
                    setDisabled(false)
                    navigation.replace('UploadedJobs')
                }
            })
        } else {
            Toast.show({
                type: 'error',
                text1: text,
                onShow: () => setDisabled(true),
                onHide: () => setDisabled(false)
            })
        }
    }

    const hasNonEmptyValue = Object.values(jobDetails).some(some => some)

    usePreventRemove(!uploadJobCompletedRef.current && hasNonEmptyValue, ({data}) => {
        Alert.alert('Discard Job Upload?', 'Are you sure you want to leave this page? Any information you’ve entered will be lost.', [
            {
                text: "Discard",
                style: "destructive",
                onPress: () => navigation.dispatch(data.action)
            },
            {
                text: "Cancel",
                style: "cancel",
            }
        ])
    })
    return (
        <ScrollView style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <View style={styles.childContainer}>
                        <View style={styles.header}>
                            <Text style={styles.headerText}>Post a job for free</Text>
                            <Text style={styles.subHeaderText}>Increase the quality of your hire</Text>
                        </View>
                        <View style={styles.viewsParent}>
                            <View style={styles.row}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.labels}>Job Position*</Text>
                                    <TextInput editable={!disabled} style={styles.textInputs}
                                               value={jobDetails.position}
                                               onChangeText={text => handleChange("position", text)}/>
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.labels}>Company*</Text>
                                    <TextInput editable={!disabled} style={styles.textInputs} value={jobDetails.company}
                                               onChangeText={text => handleChange("company", text)}/>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.labels}>Job Location*</Text>
                                    <TextInput editable={!disabled} style={styles.textInputs}
                                               value={jobDetails.location}
                                               onChangeText={text => handleChange("location", text)}/>
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.labels}>Workplace Type*</Text>
                                    <WorkPlaceTypeDropDown handleChange={handleChange} workPlace={jobDetails.workPlace}
                                                           disabled={disabled}/>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.labels}>Job Function*</Text>
                                    <TextInput editable={!disabled} style={styles.textInputs}
                                               value={jobDetails.jobFunction}
                                               onChangeText={text => handleChange("jobFunction", text)}/>
                                </View>
                                <View style={[styles.inputContainer, {zIndex: 10, position: "relative"}]}>
                                    <Text style={styles.labels}>Job Type*</Text>
                                    <JobTypeDropDown handleChange={handleChange} jobType={jobDetails.jobType}
                                                     disabled={disabled}/>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View>
                                    <TextInput value={jobDetails.description} editable={!disabled}
                                               style={[styles.textInputs, {width: 160, height: 150, color: "black"}]}
                                               placeholder="Job Descriptions ..." multiline={true}
                                               onChangeText={text => handleChange("description", text)}/>
                                </View>
                                <View>
                                    <TextInput value={jobDetails.requirements} editable={!disabled}
                                               style={[styles.textInputs, {
                                                   width: 160,
                                                   height: 150,
                                                   color: "black",
                                                   zIndex: 1
                                               }]}
                                               placeholder="Job Requirements ..." multiline={true}
                                               onChangeText={text => handleChange("requirements", text)}/>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <TouchableOpacity onPress={() => handleButtons('clear')} disabled={disabled}>
                                    <Text style={styles.clearButton}>Clear</Text>
                                </TouchableOpacity>
                                <View style={{flexDirection: "row", gap: 16}}>
                                    <TouchableOpacity onPress={() => handleButtons('cancel')} disabled={disabled}>
                                        <Text style={styles.cancelButton}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleButtons('save')} disabled={disabled}>
                                        <Text style={styles.saveButton}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <Toast/>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: "#f0f2f5",
    },
    childContainer: {
        padding: 14,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "white",
        borderRadius: 2,
    },
    header: {
        flexDirection: "column",
        marginBottom: 16,
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold"
    },
    subHeaderText: {
        fontSize: 20
    },
    viewsParent: {
        flexDirection: "column",
        marginVertical: 24,
        position: 'relative',
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 20,
    },
    inputContainer: {
        flex: 1,
        marginRight: 16,
        zIndex: 1
    },
    labels: {
        fontSize: 18,
    },
    textInputs: {
        maxWidth: "100%",
        height: 40,
        borderRadius: 4,
        marginTop: 6,
        padding: 6,
        fontSize: 16,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderColor: "gray",
        borderWidth: 0.4
    },
    clearButton: {
        width: 72,
        height: 30,
        color: "#367c2b",
        fontWeight: "bold",
        borderWidth: 1,
        borderRadius: 2,
        textAlign: "center",
        borderColor: "#367c2b",
        padding: 6,
        fontSize: 16
    },
    cancelButton: {
        width: 72,
        height: 30,
        color: "#367c2b",
        fontWeight: "bold",
        borderWidth: 1,
        borderRadius: 2,
        textAlign: "center",
        borderColor: "#367c2b",
        padding: 6,
        fontSize: 16
    },
    saveButton: {
        width: 72,
        height: 30,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: "white",
        textAlign: "center",
        backgroundColor: "#ffde00",
        padding: 6,
        fontWeight: "bold",
        fontSize: 16
    }
});

export default UploadJob;
