import {Modal, StyleSheet, TouchableOpacity, View} from "react-native";
import WebView from "react-native-webview";
import Icon from "react-native-vector-icons/MaterialIcons";

interface ResumeViewerProps {
    handleDisplayModel: () => void;
    resumeDetails: { resumeName: string; resume: string };
}

const ResumeViewer = ({handleDisplayModel, resumeDetails}: ResumeViewerProps) => {
    const html = `<embed width="100%" height="100%" src="data:application/pdf;base64,${resumeDetails.resume}">`;
    return (
        <Modal
            visible={true}
            transparent={true}
            animationType="slide">
            <View style={styles.overlay}>
                <TouchableOpacity
                    style={styles.outsideTouchable}
                    onPress={handleDisplayModel}
                    activeOpacity={1}
                />
                <View style={styles.modalContent}>
                    <TouchableOpacity onPress={handleDisplayModel} style={styles.closeButton}>
                        <Icon name="close" size={28} color="gray"/>
                    </TouchableOpacity>
                    <WebView source={{html: html}}/>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
    },
    outsideTouchable: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalContent: {
        width: '90%',
        height: '62%',
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
