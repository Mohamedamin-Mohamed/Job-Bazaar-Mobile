import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator
} from "react-native";
import {useState} from "react";
import emailLookup from "../fetchRequests/emailLookup";
import Toast from "react-native-toast-message";
import emailValidation from "../Regex/emailValidation";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../Types/types";

type ForgotPassword = StackNavigationProp<RootStackParamList, 'ForgotPassword'>

const ForgotPassword = ({navigation}: { navigation: ForgotPassword }) => {
    const [email, setEmail] = useState('')
    const [err, setErr] = useState('')
    const [disabled, setDisabled] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        if (!email) {
            setErr('Email is required')
            return
        }
        const emailValid = emailValidation(email)
        if (!emailValid) {
            setErr('Email is not valid')
            return
        }
        setErr('')
        try {
            setLoading(true)
            const emailVerify = await emailLookup(email)
            const message = await emailVerify.text()
            if (emailVerify.ok) {
                Toast.show({
                    type: 'success',
                    text1: message,
                    onShow: () => setDisabled(true),
                    onHide: () => {
                        setDisabled(false)
                        navigation.navigate('ResetPassword')
                    }
                })
            } else {
                Toast.show({
                    type: 'error',
                    text1: message,
                    onShow: () => setDisabled(true),
                    onHide: () => {
                        setDisabled(false)
                        navigation.replace('Signup')
                    }
                })
            }
        } catch (exp) {
            throw exp
        } finally {
            setLoading(false)
        }
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.parentContainer}>
                <View style={styles.childContainer}>
                    <Text style={[styles.headerText]}>Forgot Password</Text>
                    <View style={{marginVertical: 12}}>
                        <Text style={styles.textCentered}>Enter your email to find account.</Text>
                    </View>
                    <TextInput autoCapitalize="none" editable={!disabled} style={styles.passwordInput}
                               keyboardType="email-address"
                               onChangeText={setEmail}/>
                    {err && <Text style={styles.errorMessage}>{err}</Text>}
                    <TouchableOpacity disabled={disabled} onPress={() => handleSubmit()}>
                        {
                            loading ? <ActivityIndicator size="small" color="#367c2b" style={styles.submitButton}/> :
                                <Text style={styles.submitButton}>Submit</Text>
                        }
                    </TouchableOpacity>
                </View>
                <Toast/>
            </View>
        </TouchableWithoutFeedback>
    )
}
const styles = StyleSheet.create({
    parentContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    headerText: {
        color: "#367c2b",
        fontWeight: "bold",
        fontSize: 24,
        textAlign: "center"
    },
    childContainer: {
        flex: 0.32,
        borderWidth: 1,
        borderRadius: 12,
        padding: 24,
        borderColor: "white",
        backgroundColor: "white",
        width: 300,
    },
    textCentered: {
        color: "#6b7280",
        textAlign: "center",
        fontSize: 17,
    },
    passwordInput: {
        width: 250,
        height: 40,
        borderRadius: 6,
        borderWidth: 1,
        padding: 6,
        fontSize: 18,
        paddingTop: 8,
        marginBottom: 16,
        marginLeft: 4
    },
    submitButton: {
        width: 250,
        padding: 8,
        borderWidth: 1,
        borderRadius: 6,
        marginTop: 6,
        marginLeft: 4,
        fontSize: 18,
        color: "#367c2b",
        fontWeight: "bold",
        borderColor: "#367c2b",
        textAlign: "center",
    },
    errorMessage: {
        fontSize: 18,
        textAlign: "left",
        borderWidth: 1,
        borderRadius: 16,
        borderColor: "#ffebe8",
        backgroundColor: "#ffebe8",
        marginBottom: 10,
        width: 250,
        padding: 5
    },
})
export default ForgotPassword