import {
    Keyboard,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {Dispatch, SetStateAction, useState} from "react";
import deleteAccount from "@/app/FetchRequests/deleteAccount";
import {User} from "@/Types/types";

interface DeleteAccountConfirmationProps {
    displayModal: boolean,
    handleDisplayModal: () => void
    userInfo: User
    setDisabled: Dispatch<SetStateAction<boolean>>
    setMessageResponse: Dispatch<SetStateAction<MessageResponse>>
}

type MessageResponse = {
    message: string | undefined, status: number
}

const DeleteAccountConfirmation = ({
                                       displayModal,
                                       handleDisplayModal,
                                       userInfo,
                                       setMessageResponse
                                   }: DeleteAccountConfirmationProps) => {
    const [deleteText, setDeleteText] = useState('')
    const [matches, setMatches] = useState(true)

    const email = userInfo.email
    const role = userInfo.role

    const handleAccountDeletion = async () => {
        if (deleteText !== 'DELETE') {
            setMatches(false)
            return
        }
        setMatches(true)
        const response = await deleteAccount(email, role);
        const message = await response.text()
        const status = response.status

        setMessageResponse({message: status === 500 ? 'Account deletion failed' : message, status: status})
        handleDisplayModal()
    }

    return (
        <Modal visible={displayModal} transparent={true} animationType="slide">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.overlay}>
                    <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={handleDisplayModal}/>
                    <View style={styles.modalContent}>
                        <Text style={styles.header}>Delete your Account</Text>
                        <View style={styles.subHeaderView}>
                            <Text style={styles.subHeader}>Deleting your account will permanently remove all data
                                associated
                                with your role.</Text>
                            <Text style={styles.subHeader}>Are your sure you want to continue?</Text>
                        </View>
                        <Text style={styles.normalText}>Type DELETE to confirm</Text>
                        <TextInput style={styles.textInput} value={deleteText} onChangeText={setDeleteText}/>
                        {!matches && <Text style={styles.errText}>Please match the requested format</Text>}
                        <View>
                            <TouchableOpacity style={styles.buttonView} onPress={handleAccountDeletion}>
                                <Text style={styles.buttonText}>Delete your Account</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButtonView} onPress={handleDisplayModal}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    header: {
        fontSize: 18,
        fontWeight: "500"
    },
    subHeaderView: {
        borderRadius: 4,
        borderWidth: 0.6,
        borderColor: "red",
        padding: 16,
        marginVertical: 20
    },
    subHeader: {
        color: "#ef4444",
        fontSize: 16
    },
    normalText: {
        fontWeight: "500",
        fontSize: 16
    },
    textInput: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "gray",
        padding: 10,
        marginTop: 16
    },
    errText: {
        color: "#ef4444",
        marginTop: 10
    },
    buttonView: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ef4444",
        padding: 10,
        borderRadius: 4,
        borderWidth: 0.4,
        marginTop: 20,
        borderColor: "white"
    },
    buttonText: {
        color: "#f9fafb",
        fontSize: 16,
        fontWeight: "500"
    },
    cancelButtonView: {
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        borderRadius: 4,
        borderWidth: 0.4,
        marginTop: 20,
        borderColor: "gray"
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: "500"
    }
})
export default DeleteAccountConfirmation