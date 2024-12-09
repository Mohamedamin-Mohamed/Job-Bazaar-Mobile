import {
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {JobApplication, RootStackParamList, RootState} from "../Types/types";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {CheckBox} from '@rneui/themed';
import {useState} from "react";
import Toast from "react-native-toast-message";
import {useSelector} from "react-redux";
import applyToJobFormData from "./applyToJobFormData";
import * as DocumentPicker from 'expo-document-picker';
import Buttons from "../FixedButtons/Buttons";
import applyToJob from "../fetchRequests/applyToJob";

type ApplyNavigationProps = NativeStackScreenProps<RootStackParamList, 'Apply'>
const Apply = ({navigation, route}: ApplyNavigationProps) => {
    const {job} = route.params
    const [toggleCheckBox1, setToggleCheckBox1] = useState(false)
    const [toggleCheckBox2, setToggleCheckBox2] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [loading, setLoading] = useState(false)

    const userInfo = useSelector((state: RootState) => state.userInfo)

    const initialJobApplicationState: JobApplication = {
        resume: {name: '', file: {fileUri: '', mimeType: '', size: 0}},
        country: '',
        city: '',
        postalCode: '',
        gender: '',
        nationality: '',
        additionalDocument: {name: '', file: {fileUri: '', mimeType: '', size: 0}},
        employerContact: '',
        position: job.position,
        jobId: job.jobId,
        employerEmail: job.employerEmail
    }
    const [jobApplication, setJobApplication] = useState<JobApplication>(initialJobApplicationState)

    const handleChange = (name: string, value: string) => {
        setJobApplication((prevState) => ({
            ...prevState, [name]: value
        }))
    }

    const handleClear = () => {
        setJobApplication(initialJobApplicationState)
        setToggleCheckBox1(false)
        setToggleCheckBox2(false)
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

    const checkIfAllFieldsUpdated = (jobApplication: JobApplication) => {
        return (
            jobApplication.country !== '' &&
            jobApplication.city !== '' &&
            jobApplication.postalCode !== '' &&
            jobApplication.gender !== '' &&
            jobApplication.nationality !== '' &&
            jobApplication.resume.name !== null &&
            jobApplication.resume.file?.fileUri !== '' &&
            jobApplication.resume.file?.mimeType !== '' &&
            (toggleCheckBox1 || toggleCheckBox2)
        )
    }

    const handleSave = async () => {
        const updatedJobApplication = {
            ...jobApplication,
            employerContact: !toggleCheckBox1 && !toggleCheckBox2 ? '' : toggleCheckBox1 ? 'all available jobs' : 'only roles I apply to'
        };
        setJobApplication(updatedJobApplication);

        const updated = checkIfAllFieldsUpdated(updatedJobApplication);

        if (!updated) {
            Toast.show({
                type: 'error',
                text1: 'Please fill out all the required fields*',
                onShow: () => setDisabled(true),
                onHide: () => setDisabled(false)
            })
            return
        } else {
            try {
                setLoading(true)
                const formData = await applyToJobFormData(updatedJobApplication, userInfo)

                const response = await applyToJob(formData)
                const text = await response.text()

                Toast.show({
                    type: response.ok ? 'success' : 'error',
                    text1: text,
                    onShow: () => setDisabled(true),
                    onHide: () => {
                        setDisabled(false)
                        response.ok ? navigation.navigate('AvailableJobs') : handleButtons('clear')
                    }
                })
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
    }

    const handleFileUpload = async (type: string) => {
        const result = await DocumentPicker.getDocumentAsync({type: "application/pdf"});
        if (!result.canceled) {
            const {name, uri, type, size} = result.assets.values().next().value;

            if (type === "resume") {
                setJobApplication(prevState => ({
                    ...prevState,
                    resume: {
                        name: name,
                        file: {fileUri: uri, mimeType: type, size}
                    }
                }))
            } else {
                setJobApplication(prevState => ({
                    ...prevState,
                    additionalDocument: {
                        name: name,
                        file: {fileUri: uri, mimeType: type, size}
                    }
                }))
            }
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.childContainer}>
                        <View>
                            <Text style={{fontSize: 24, fontWeight: "bold"}}>Submit Application</Text>
                            <View style={{flexDirection: "row", gap: 24, marginTop: 4, marginBottom: 24}}>
                                <Text style={styles.headerText}>{job.jobId}</Text>
                                <Text style={styles.headerText}>{job.position}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: "row"}}>
                            <Text style={styles.labels}>Resume*</Text>
                            <View style={{flexDirection: "column", marginLeft: "auto"}}>
                                <Text
                                    style={[styles.resumeText, jobApplication.resume.name ? {width: "44%"} : {}]}>{jobApplication.resume.name ? jobApplication.resume.name : "No Resume Available"}</Text>
                                <TouchableOpacity onPress={() => handleFileUpload('resume')} disabled={disabled}>
                                    <Text style={styles.uploadResumeButton}>Upload Resume...</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.viewParent}>
                            <Text style={styles.labels}>Country*</Text>
                            <TextInput value={jobApplication.country} keyboardType="default" style={styles.textInputs}
                                       onChangeText={text => handleChange('country', text)} editable={!disabled}/>
                        </View>
                        <View style={styles.viewParent}>
                            <Text style={styles.labels}>City*</Text>
                            <TextInput value={jobApplication.city} keyboardType="default" style={styles.textInputs}
                                       onChangeText={text => handleChange('city', text)} editable={!disabled}/>
                        </View>
                        <View style={styles.viewParent}>
                            <Text style={styles.labels}>Postal Code*</Text>
                            <TextInput value={jobApplication.postalCode} keyboardType="default"
                                       style={styles.textInputs}
                                       onChangeText={text => handleChange('postalCode', text)} editable={!disabled}/>
                        </View>
                        <View style={styles.viewParent}>
                            <Text style={styles.labels}>Gender*</Text>
                            <TextInput value={jobApplication.gender} keyboardType="default" style={styles.textInputs}
                                       onChangeText={text => handleChange('gender', text)} editable={!disabled}/>
                        </View>
                        <View style={styles.viewParent}>
                            <Text style={styles.labels}>Nationality*</Text>
                            <TextInput value={jobApplication.nationality} keyboardType="default"
                                       style={styles.textInputs}
                                       onChangeText={text => handleChange('nationality', text)} editable={!disabled}/>
                        </View>
                        <View style={{flexDirection: "row", marginVertical: 24}}>
                            <Text style={[styles.labels, {fontSize: 17, width: "40%"}]}>Additional Attachments</Text>
                            <View style={{flexDirection: "column", marginLeft: "auto"}}>
                                <Text
                                    style={[styles.resumeText, jobApplication.additionalDocument.name ? {width: "44%"} : {}]}>
                                    {jobApplication.additionalDocument.name ? jobApplication.additionalDocument.name : "Upload documents(s)"} </Text>
                                <TouchableOpacity onPress={() => handleFileUpload('additionalDoc')} disabled={disabled}>
                                    <Text style={[styles.uploadResumeButton]}>Additional Doc..</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{flexDirection: "row", width: "40%", marginVertical: 24}}>
                            <Text style={{marginTop: 12, fontSize: 14}}>Consent to contact for roles. *</Text>
                            <View style={{flexDirection: "column", marginTop: 10, gap: 12}}>
                                <View style={{flexDirection: "row"}}>
                                    <CheckBox checked={toggleCheckBox1}
                                              disabled={disabled}
                                              onPress={() => {
                                                  setToggleCheckBox1(!toggleCheckBox1)
                                                  setToggleCheckBox2(false)
                                              }
                                              }
                                    />
                                    <Text style={{width: "80%", fontSize: 16}}>Employers can contact me for any open
                                        positions</Text>
                                </View>
                                <View style={{flexDirection: "row"}}>
                                    <CheckBox checked={toggleCheckBox2} disabled={disabled}
                                              onPress={() => {
                                                  setToggleCheckBox2(!toggleCheckBox2)
                                                  setToggleCheckBox1(false)
                                              }
                                              }
                                    />
                                    <Text style={{width: "80%", fontSize: 16}}>Employers can contact me for only the
                                        roles I apply to.</Text>
                                </View>
                            </View>
                        </View>
                        <Buttons handleButtons={handleButtons} disabled={disabled} loading={loading}/>
                    </View>
                </View>
                <Toast/>
            </ScrollView>
        </TouchableWithoutFeedback>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    childContainer: {
        flex: 1,
        padding: 24,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: "white",
        backgroundColor: "white",
        width: "100%",
    },
    headerView: {
        flexDirection: "row",
        gap: 18,
        marginTop: 4,
        marginBottom: 24
    },
    headerText: {
        fontSize: 16,
        fontWeight: "bold"
    },
    labels: {
        fontSize: 18,
        marginTop: 16
    },
    textInputs: {
        marginLeft: "auto",
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
    viewParent: {
        flexDirection: "row",
        marginVertical: 12,
        gap: 36
    },
    resumeText: {
        fontSize: 14.5,
        marginBottom: 18,
        marginLeft: "auto",
    },
    uploadResumeButton: {
        marginLeft: "auto",
        backgroundColor: "#f3f4f6",
        borderColor: "white",
        fontSize: 14,
        width: 140,
        height: 48,
        textAlign: "center",
        padding: 16,
        fontWeight: "bold",
        borderWidth: 1,
        borderRadius: 8,
    }
})
export default Apply