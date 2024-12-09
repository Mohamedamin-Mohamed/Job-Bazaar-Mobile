import {Text, TextInput, View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard} from "react-native";
import {useState} from "react";
import WorkPlaceTypeDropDown from "./DropDowns/WorkPlaceTypeDropDown";
import {JobDetails, RootStackParamList, RootState} from "../Types/types";
import JobTypeDropDown from "./DropDowns/JobTypeDropDown";
import {StackNavigationProp} from "@react-navigation/stack";
import Toast from "react-native-toast-message";
import {format} from "date-fns";
import {useSelector} from "react-redux";
import uploadJob from "../fetchRequests/uploadJob";

type UploadJobNavigationProp = StackNavigationProp<RootStackParamList, 'UploadJob'>

const UploadJob = ({navigation}: { navigation: UploadJobNavigationProp }) => {
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
                setJobDetails(initialJobDetails)
                break
            }
            case 'cancel': {
                navigation.goBack()
                break
            }
            case 'save': {
                handleSave()
                break
            }

        }
    }
    const handleSave = async () => {
        const hasNoMissingValues = Object.values(jobDetails).every(value => value !== '')
        console.log('Missing value is ', hasNoMissingValues)
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
        if (response.ok) {
            Toast.show({
                type: 'success',
                text1: text,
                onShow: () => setDisabled(true),
                onHide: () => {
                    setDisabled(false)
                    navigation.navigate('UploadedJobs')
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
    return (
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
                                <TextInput editable={!disabled} style={styles.textInputs} value={jobDetails.position}
                                           onChangeText={text => handleChange("position", text)}
                                           keyboardType="default"/>
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.labels}>Company*</Text>
                                <TextInput editable={!disabled} style={styles.textInputs} value={jobDetails.company}
                                           onChangeText={text => handleChange("company", text)} keyboardType="default"/>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.labels}>Job Location*</Text>
                                <TextInput editable={!disabled} style={styles.textInputs} value={jobDetails.location}
                                           onChangeText={text => handleChange("location", text)}
                                           keyboardType="default"/>
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.labels}>Workplace Type*</Text>
                                <WorkPlaceTypeDropDown handleChange={handleChange} workPlace={jobDetails.workPlace}
                                                       disabled={disabled}/>
                                {/*<TextInput style={styles.textInputs} value={jobDetails.workPlace} onChangeText={text => handleChange("workPlace", text)} keyboardType="default"/>*/}
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.labels}>Job Function*</Text>
                                <TextInput editable={!disabled} style={styles.textInputs} value={jobDetails.jobFunction}
                                           onChangeText={text => handleChange("jobFunction", text)}
                                           keyboardType="default"/>
                            </View>
                            <View style={[styles.inputContainer, {zIndex: 10, position: "relative"}]}>
                                <Text style={styles.labels}>Job Type*</Text>
                                <JobTypeDropDown handleChange={handleChange} jobType={jobDetails.jobType}
                                                 disabled={disabled}/>
                                {/*<TextInput style={styles.textInputs} value={jobDetails.jobType} onChangeText={text => handleChange("jobType", text)} keyboardType="default"/>*/}
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View>
                                <TextInput editable={!disabled}
                                           style={[styles.textInputs, {width: 160, height: 150, color: "black"}]}
                                           placeholder="Job Descriptions ..." multiline={true}
                                           onChangeText={text => handleChange("description", text)}/>
                            </View>
                            <View>
                                <TextInput editable={!disabled}
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
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#f0f2f5",
    },
    childContainer: {
        flex: 1,
        padding: 14,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "white",
        borderRadius: 2,
    },
    header: {
        flexDirection: "column",
        marginBottom: 16, // Add space below the header
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
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3,
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
