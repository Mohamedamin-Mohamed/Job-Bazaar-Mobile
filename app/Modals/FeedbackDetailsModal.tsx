import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feedback } from "@/app/Types/types";
import Icon from "react-native-vector-icons/MaterialIcons";

interface FeedbackDetailsModalProps {
    feedback: Feedback;
    handleDisplayModal: () => void;
}

const FeedbackDetailsModal = ({ feedback, handleDisplayModal }: FeedbackDetailsModalProps) => {
    return (
        <Modal visible={true} transparent={true} animationType="slide">
            <View style={styles.modalOverlay}>
                <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={handleDisplayModal} />
                <View style={styles.modalContent}>
                    <View style={styles.headerView}>
                        <Text style={styles.headerText}>Feedback Details</Text>
                        <Icon name="close" size={30} color="gray" onPress={handleDisplayModal} />
                    </View>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.detailItem}>
                            <Text style={styles.label}>Email:</Text> {feedback.applicantEmail}
                        </Text>
                        <Text style={styles.detailItem}>
                            <Text style={styles.label}>Job ID:</Text> {feedback.jobId}
                        </Text>
                        <Text style={styles.detailItem}>
                            <Text style={styles.label}>Feedback Date:</Text> {feedback.feedbackDate}
                        </Text>
                        <Text style={styles.detailItem}>
                            <Text style={styles.label}>Feedback:</Text> {feedback.feedback}
                        </Text>
                        <Text style={styles.detailItem}>
                            <Text style={styles.label}>Application Status:</Text> {feedback.status}
                        </Text>
                    </View>
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
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        width: "85%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    headerView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    detailsContainer: {
        paddingVertical: 10,
    },
    detailItem: {
        fontSize: 16,
        color: "#555",
        marginBottom: 10,
    },
    label: {
        fontWeight: "bold",
        color: "#333",
    },
});

export default FeedbackDetailsModal;
