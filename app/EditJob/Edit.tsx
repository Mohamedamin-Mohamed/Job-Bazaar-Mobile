import {Alert, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {EditJobDetails, RootStackParamList, RootState} from "@/Types/types";
import {useSelector} from "react-redux";
import WorkPlaceTypeDropDown from "@/app/Modals/DropDowns/WorkPlaceTypeDropDown";
import {useRef, useState} from "react";
import JobTypeDropDown from "@/app/Modals/DropDowns/JobTypeDropDown";
import Buttons from "../FixedButtons/Buttons";
import Toast from "react-native-toast-message";
import uploadJob from "@/app/FetchRequests/uploadJob";
import {usePreventRemove} from "@react-navigation/native";

type EditNavigationProps = NativeStackScreenProps<RootStackParamList, 'Edit'>

const Edit = ({route, navigation}: EditNavigationProps) => {
    const {job} = route.params
    const editJobCompletedRef = useRef(false)
    const userInfo = useSelector((state: RootState) => state.userInfo)
    const [disabled, setDisabled] = useState(false)
    const [loading, setLoading] = useState(false)

    const [initialJobDetails, setInitialJobDetails] = useState<EditJobDetails>({
        employerEmail: job.employerEmail,
        jobId: job.jobId,
        company: job.company,
        description: job.description,
        jobFunction: job.jobFunction,
        jobStatus: job.jobStatus,
        jobType: job.jobType,
        location: job.location,
        postedDate: job.postedDate,
        requirements: job.requirements,
        workPlace: job.workPlace,
        position: job.position
    })
    const [jobDetails, setJobDetails] = useState<EditJobDetails>(initialJobDetails)

    const handleChange = (name: string, value: string) => {
        setJobDetails(prevState => ({
            ...prevState, [name]: value
        }))
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
        const keys = Object.keys(initialJobDetails) as (keyof EditJobDetails)[]
        for (const key of keys) {
            if (initialJobDetails[key] !== jobDetails[key]) {
                return true
            }
        }
        return false
    }

    const handleSave = async () => {
        const updated = checkIfAllFieldsUpdated()
        if (!updated) {
            Toast.show({
                type: 'info',
                text1: 'No fields have been updated',
                onShow: () => setDisabled(true),
                onHide: () => setDisabled(false)
            })
        } else {
            try {
                setLoading(true)
                const response = await uploadJob(jobDetails, new AbortController())
                const text = await response.text()

                // Set the ref before showing toast by marking job edit as completed
                editJobCompletedRef.current = true;
                if (response.ok) {
                    Toast.show({
                        type: 'success',
                        text1: text,
                        onShow: () => setDisabled(true),
                        onHide: () => {
                            setDisabled(false)
                            setInitialJobDetails(jobDetails)
                            navigation.goBack()
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
            } catch (exp) {
                throw exp
            } finally {
                setLoading(false)
            }
        }
    }

    const updated = checkIfAllFieldsUpdated()
    usePreventRemove(!editJobCompletedRef.current && updated && !loading, ({data}) => {
        Alert.alert('Discard Job Edit', 'Are you sure you want to leave this page? Any information you’ve entered will be lost.', [
            {
                text: 'Discard',
                style: 'destructive',
                onPress: () => navigation.dispatch(data.action)
            },
            {
                text: 'Cancel',
                style: 'cancel',
            }
        ])
    })
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.contentContainerStyle}>
                    <View style={styles.childContainer1}>
                        <View style={styles.childContainer2}>
                            <View style={{marginVertical: 14, gap: 6}}>
                                <Text style={{fontSize: 20, fontWeight: "bold"}}>
                                    Welcome {userInfo.firstName} {userInfo.lastName}
                                </Text>
                                <Text style={{fontSize: 18}}>Edit your uploaded job</Text>
                            </View>
                            <View style={styles.parentView}>
                                <View>
                                    <Text style={styles.labels}>Job Position</Text>
                                    <TextInput
                                        editable={!disabled}
                                        style={styles.textInputs}
                                        value={jobDetails.position}
                                        onChangeText={(text) => handleChange("position", text)}
                                    />
                                </View>
                                <View style={styles.rightView}>
                                    <Text style={styles.labels}>Company</Text>
                                    <TextInput
                                        editable={!disabled}
                                        style={styles.textInputs}
                                        value={jobDetails.company}
                                        onChangeText={(text) => handleChange("company", text)}
                                    />
                                </View>
                            </View>
                            <View style={styles.parentView}>
                                <View>
                                    <Text style={styles.labels}>Workplace type</Text>
                                    <WorkPlaceTypeDropDown
                                        handleChange={handleChange}
                                        workPlace={jobDetails.workPlace}
                                        disabled={disabled}
                                    />
                                </View>
                                <View style={styles.rightView}>
                                    <Text style={styles.labels}>Job Location</Text>
                                    <TextInput
                                        editable={!disabled}
                                        style={styles.textInputs}
                                        value={jobDetails.location}
                                        onChangeText={(text) => handleChange("location", text)}
                                    />
                                </View>
                            </View>
                            <View style={styles.parentView}>
                                <View>
                                    <Text style={styles.labels}>Job type</Text>
                                    <JobTypeDropDown
                                        handleChange={handleChange}
                                        jobType={jobDetails.jobType}
                                        disabled={disabled}
                                    />
                                </View>
                                <View style={styles.rightView}>
                                    <Text style={styles.labels}>Job Function</Text>
                                    <TextInput
                                        editable={!disabled}
                                        style={styles.textInputs}
                                        value={jobDetails.jobFunction}
                                        onChangeText={(text) => handleChange("jobFunction", text)}
                                    />
                                </View>
                            </View>
                            <View style={styles.textAreasParentView}>
                                <TextInput
                                    style={styles.textAreas}
                                    value={jobDetails.description}
                                    multiline={true}
                                    onChangeText={(text) => handleChange("description", text)}
                                />
                                <TextInput
                                    editable={!disabled}
                                    style={[styles.textAreas, {marginLeft: "auto"}]}
                                    value={jobDetails.requirements}
                                    multiline={true}
                                    onChangeText={(text) => handleChange("requirements", text)}
                                />
                            </View>
                            <View style={styles.buttonsView}>
                                <Buttons handleButtons={handleButtons} disabled={disabled} loading={loading}/>
                            </View>
                        </View>
                        <Toast/>
                    </View>
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    contentContainerStyle: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    childContainer1: {
        width: "100%",
        maxWidth: 600,
        padding: 20,
    },
    childContainer2: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 24,
        borderColor: "white",
        backgroundColor: "white",
    },
    labels: {
        fontSize: 18,
        fontWeight: "bold"
    },
    textInputs: {
        width: 140,
        height: 36,
        borderRadius: 4,
        marginTop: 6,
        padding: 6,
        fontSize: 16,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        shadowOffset: {
            width: 0, height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    parentView: {
        flexDirection: "row",
        marginVertical: 12
    },
    rightView: {
        marginLeft: "auto",
        marginRight: 4
    },
    textAreas: {
        borderRadius: 4,
        marginTop: 6,
        padding: 6,
        fontSize: 16,
        backgroundColor: "white",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3,
        width: 140,
        height: 150,
        color: "black",
    },
    textAreasParentView: {
        flexDirection: "row",
        marginTop: 16
    },
    buttonsView: {
        marginTop: 40
    }

})
export default Edit