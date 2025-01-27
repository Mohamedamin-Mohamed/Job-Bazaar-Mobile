import {Modal, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {JobApplicationData, RootStackParamList} from "@/Types/types";
import {useState} from "react";
import {CheckBox} from "@rneui/themed";
import Icon from "react-native-vector-icons/MaterialIcons";
import {format} from "date-fns";
import updateApplication from "@/app/FetchRequests/updateApplication";
import uploadFeedback from "@/app/FetchRequests/uploadFeedback";
import Toast from "react-native-toast-message";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

interface FeedbackModalProps {
    jobApplicant: JobApplicationData;
    handleDisplayModal: () => void;
    navigation: NativeStackNavigationProp<RootStackParamList, "ViewApplicants">;
}

const feedbackOptions = ['Received', 'In Review', 'Interview Scheduled', 'Rejected', 'Hired'];

const FeedbackModal = ({jobApplicant, handleDisplayModal, navigation}: FeedbackModalProps) => {
    const [disabled, setDisabled] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [selectedFeedbackOption, setSelectedFeedbackOption] = useState<string | null>(null);

    const handleSelectFeedback = (feedback: string) => setSelectedFeedbackOption(prev => prev === feedback ? null : feedback);

    const handleFeedbackSubmit = async () => {
        const formattedDate = format(new Date(), "MM-yyyy-dd");
        const isRejected = selectedFeedbackOption === 'Rejected';
        const requestBody = {
            applicantEmail: jobApplicant.applicantEmail,
            jobId: jobApplicant.jobId,
            feedbackDate: formattedDate,
            feedback,
            status: selectedFeedbackOption!.charAt(0).toUpperCase() + selectedFeedbackOption!.slice(1),
        };

        try {
            const [updateResponse, feedbackResponse] = await Promise.all([
                updateApplication(jobApplicant.applicantEmail, jobApplicant.jobId, isRejected ? "Declined" : selectedFeedbackOption, new AbortController()),
                uploadFeedback(requestBody, new AbortController())
            ]);

            const success = updateResponse.ok && feedbackResponse.ok;
            const text = await feedbackResponse.text();

            Toast.show({
                type: success ? 'success' : 'error',
                text1: text,
                onShow: () => setDisabled(true),
                onHide: () => {
                    setDisabled(false);
                    handleDisplayModal();
                    navigation.pop(3)
                    navigation.navigate('ManagementHub')
                }
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Modal visible={true} transparent={true} animationType="slide">
            <View style={styles.modalOverlay}>
                <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={handleDisplayModal}/>
                <View style={styles.modalContent}>
                    <View style={styles.headerView}>
                        <Text style={styles.headerText}>Provide Feedback</Text>
                        <Icon name="close" size={30} color="gray" onPress={handleDisplayModal}/>
                    </View>
                    <Text style={styles.feedbackText}>Feedback</Text>
                    <TextInput
                        value={feedback}
                        onChangeText={setFeedback}
                        style={styles.textInput}
                        editable={!disabled}
                        multiline={true}
                        placeholder="Enter your feedback"
                    />
                    <Text style={styles.feedbackText}>Status</Text>
                    <View style={styles.feedbackOptions}>
                        {feedbackOptions.map((option, index) => (
                            <View key={index} style={styles.feedbackOption}>
                                <CheckBox
                                    title={option}
                                    checked={selectedFeedbackOption === option}
                                    onPress={() => handleSelectFeedback(option)}
                                    containerStyle={styles.checkboxContainer}
                                    checkedColor="#28a745"
                                    uncheckedColor="#aaa"
                                />
                            </View>
                        ))}
                    </View>
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleFeedbackSubmit}
                        disabled={!selectedFeedbackOption}
                    >
                        <Text style={styles.submitButtonText}>Submit Feedback</Text>
                    </TouchableOpacity>
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
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#f9f9f9",
        borderRadius: 4,
        padding: 20,
        width: "90%",
        maxHeight: "80%",
        marginTop: 38,
    },
    headerView: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
    feedbackText: {
        fontSize: 17,
        fontWeight: "500",
        marginBottom: 8,
    },
    textInput: {
        textAlignVertical: "top",
        height: 100,
        borderRadius: 4,
        marginTop: 6,
        padding: 6,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "gray",
        marginVertical: 24,
    },
    feedbackOptions: {
        marginVertical: 10,
    },
    feedbackOption: {
        flexDirection: "row",
        alignItems: "center",
    },
    checkboxContainer: {
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
    submitButton: {
        backgroundColor: "#28a745",
        padding: 10,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default FeedbackModal;
