import {Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import mimeTypes from "../Types/mimeTypes";
//import PdfViewer from "rn-pdf-reader-js"
interface ResumeViewerProps {
    handleDisplayModel: () => void;
    showModal: boolean;
    resumeDetails: { resumeName: string; resume: string };
}

const ResumeViewer = ({handleDisplayModel, showModal, resumeDetails}: ResumeViewerProps) => {
    const fileExtension = resumeDetails.resumeName.split('.').pop() as keyof typeof mimeTypes;
    const mimeType = mimeTypes[`${fileExtension}`] || 'application/octet-stream';

    //Convert the encoded base64 string to a data URL
    const resumeDataUri = `data:${mimeType};base64,${resumeDetails.resume}`;
    return (
        <Modal
            visible={showModal}
            transparent={true}
            animationType="slide"
        >
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <TouchableOpacity onPress={handleDisplayModel} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                    {/*<PdfViewer source={{uri: resumeDataUri}}/>*/}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 0.95,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
    },
    modalContent: {
        width: '100%',
        height: '64%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 10,
    },
    closeButtonText: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 18,
    },
    webView: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});

export default ResumeViewer;
