import {RootStackParamList, RootState} from "@/Types/types";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import DeleteAccountConfirmation from "@/app/Modals/DeleteAccountConfirmation";
import Toast from "react-native-toast-message";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {CommonActions} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type MessageResponse = {
    message: string | undefined, status: number
}

const ViewSettings = ({navigation}: { navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'> }) => {
    const userInfo = useSelector((state: RootState) => state.userInfo)
    const role = userInfo.role

    const [displayModal, setDisplayModal] = useState(false)
    const [messageResponse, setMessageResponse] = useState<MessageResponse>({message: '', status: 0})
    const [disabled, setDisabled] = useState(false)

    const handleDisplayModal = () => {
        setDisplayModal(prevState => !prevState)
    }

    const resetState = () => {
        navigation.dispatch(CommonActions.reset({
            index: 0,
            routes: [{name: 'Landing'}]
        }))
    }

    const toastDisplay = () => {
        Toast.show({
            type: messageResponse?.status === 200 ? "success" : "error",
            text1: messageResponse?.message,
            onShow: () => setDisabled(true),
            text2: messageResponse?.status === 200 ? 'Signing out...' : '',
            onHide: () => {
                setDisabled(false)
                if (messageResponse?.status === 200) {
                    AsyncStorage.removeItem('token')
                        .then(() => resetState())
                        .catch(error => console.error('AsyncStorage removal error:', error))
                }
            }
        })

    }

    useEffect(() => {
        if (messageResponse?.message && messageResponse.status) {
            toastDisplay()
        }
    }, [messageResponse]);

    return (
        <View style={styles.container}>
            <View style={styles.childContainer}>
                {displayModal &&
                    <DeleteAccountConfirmation
                        displayModal={displayModal}
                        handleDisplayModal={handleDisplayModal}
                        userInfo={userInfo}
                        setMessageResponse={setMessageResponse}
                        setDisabled={setDisabled}
                    />}
                <View style={styles.headerView}>
                    <Text style={styles.header}>Danger Zone</Text>
                    <Text style={styles.subHeader}>Some actions cannot be undone. Please be careful</Text>
                </View>
                <View style={styles.headerView2}>
                    <Text style={styles.header2}>Delete your Account</Text>
                    <Text style={styles.subHeader}>Deleting your account will permanently remove all data associated
                        with your role.
                        {role === 'Applicant' ?
                            <Text>Your job application history, referrals, and feedback will be wiped out.</Text> :
                            <Text>All jobs you have uploaded, along with the tracking information for applicants who
                                applied
                                to those jobs, will be deleted.</Text>
                        }
                    </Text>
                </View>
                <TouchableOpacity disabled={disabled} style={styles.buttonView} onPress={handleDisplayModal}>
                    <Text style={styles.buttonText}>Delete your Account</Text>
                </TouchableOpacity>
            </View>
            <Toast/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 0.5,
        justifyContent: "center",
        alignItems: "center"
    },
    childContainer: {
        padding: 24,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: "red",
        backgroundColor: "white",
        width: "90%",
    },
    headerView: {
        marginBottom: 24
    },
    header: {
        fontSize: 18,
        fontWeight: "500"
    },
    subHeader: {
        color: "#6b7280",
        fontSize: 14
    },
    headerView2: {
        marginTop: 8,
        gap: 4
    },
    header2: {
        fontWeight: "500"
    },
    buttonView: {
        alignSelf: "flex-start",
        backgroundColor: "#ef4444",
        padding: 10,
        borderRadius: 4,
        borderWidth: 0.6,
        marginTop: 20,
        borderColor: "white"
    },
    buttonText: {
        color: "#f9fafb",
        fontSize: 16
    }
})
export default ViewSettings