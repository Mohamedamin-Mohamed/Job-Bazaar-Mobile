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
import getUserInfo from "@/app/FetchRequests/getUserInfo";
import Toast from "react-native-toast-message";
import passwordReset from "@/app/FetchRequests/passwordReset";
import {useSelector} from "react-redux";
import {RootStackParamList, RootState} from "@/Types/types";
import {StackNavigationProp} from "@react-navigation/stack";

type ResetPasswordProp = StackNavigationProp<RootStackParamList, 'ResetPassword'>

const ResetPassword = ({navigation}: { navigation: ResetPasswordProp }) => {
    const email = useSelector((state: RootState) => state.userInfo.email)
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [err, setErr] = useState('')
    const [passwords, setPasswords] = useState({
        newPass: '', confirmPass: ''
    })
    const handlePasswords = (name: string, value: string) => {
        setPasswords(prevState => ({
            ...prevState, [name]: value
        }))
    }
    const handleSubmit = async () => {
        if (!passwords.newPass && !passwords.confirmPass) {
            setErr('Passwords are required')
            return
        } else if (passwords.newPass !== passwords.confirmPass) {
            setErr("Passwords don't match")
            return;
        } else {
            // Check if the password is at least 16 characters OR at least 8 characters including a number and a letter
            const hasLetter = /[a-zA-Z]/.test(passwords.newPass)
            const hasNumber = /[0-9]/.test(passwords.confirmPass)

            if (!(passwords.newPass.length >= 16 ||
                (passwords.confirmPass.length >= 8 && hasLetter && hasNumber))) {
                setErr('Password must be at least 16 characters, or 8 characters with one number and one letter.')
                return
            } else {
                setErr('')
                try {
                    setLoading(true)
                    const userInfoResponse = await getUserInfo(email, new AbortController())
                    if (userInfoResponse.ok) {
                        const user = await userInfoResponse.json()
                        const requestBody = {
                            ...user, password: passwords.confirmPass
                        }
                        const passwordResetResponse = await passwordReset(requestBody)
                        const message = await passwordResetResponse.text()
                        if (passwordResetResponse.ok) {
                            Toast.show({
                                type: 'success',
                                text1: message,
                                onShow: () => setDisabled(true),
                                onHide: () => {
                                    setDisabled(false)
                                    navigation.replace('Login')
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

                    } else {
                        Toast.show({
                            type: 'error',
                            text1: 'Something went wrong',
                            onShow: () => setDisabled(true),
                            onHide: () => {
                                setDisabled(false)
                                navigation.goBack()
                            }
                        })
                    }
                } catch (exp) {
                    throw exp
                } finally {
                    setLoading(false)
                }
            }
        }
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.parentContainer}>
                <View
                    style={[styles.childContainer, err ? (err.length > 22 ? {flex: 0.54} : {flex: 0.44}) : {flex: 0.4}]}>
                    <Text style={[styles.headerText]}>Password Reset</Text>
                    <View style={{marginVertical: 12}}>
                        <Text style={styles.textCentered}>Set a new password.</Text>
                    </View>
                    <TextInput secureTextEntry={true} autoCapitalize="none" editable={!disabled}
                               style={styles.passwordInput} keyboardType="default"  placeholderTextColor="#2b2b2b"
                               onChangeText={text => handlePasswords('newPass', text)} passwordRules="minlength: 16"
                               placeholder="New Password"/>
                    <TextInput secureTextEntry={true} autoCapitalize="none" editable={!disabled}
                               style={styles.passwordInput} keyboardType="default" placeholderTextColor="#2b2b2b"
                               onChangeText={text => handlePasswords('confirmPass', text)}
                               placeholder="Confirm new password"/>
                    {err && <Text style={styles.errorMessage}>{err}</Text>}
                    <TouchableOpacity disabled={disabled} onPress={() => handleSubmit()}>
                        {
                            loading ? <ActivityIndicator size="small" color="#367c2b" style={styles.resetPassButton}/> :
                                <Text style={styles.resetPassButton}>Reset Password</Text>
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
        fontWeight: "bold",
        fontSize: 18,
        textAlign: "center"
    },
    childContainer: {
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
        fontWeight: "bold",
        marginVertical: 4
    },
    passwordInput: {
        borderColor: "gray",
        width: 250,
        height: 40,
        borderRadius: 4,
        borderWidth: 0.8,
        padding: 8,
        fontSize: 18,
        paddingTop: 8,
        marginBottom: 16,
        marginLeft: 4
    },
    resetPassButton: {
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
        borderRadius: 4,
        borderColor: "#ffebe8",
        backgroundColor: "#ffebe8",
        marginBottom: 10,
        width: 250,
        padding: 5
    },
})
export default ResetPassword