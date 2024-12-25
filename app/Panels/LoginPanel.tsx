import {
    ActivityIndicator,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {useState} from "react";
import login from "../fetchRequests/login";
import Toast from "react-native-toast-message";
import {useDispatch, useSelector} from "react-redux";
import {RootStackParamList, RootState} from "../Types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {setUserInfo} from "../Redux/userSlice";
import {StackNavigationProp} from "@react-navigation/stack";

type LoginPanelNavigationProp = StackNavigationProp<RootStackParamList, 'LoginPanel'>

const LoginPanel = ({navigation}: { navigation: LoginPanelNavigationProp }) => {
    const email = useSelector((state: RootState) => state.userInfo.email)
    const dispatch = useDispatch()
    const [password, setPassword] = useState('')
    const [err, setErr] = useState('')
    const [disabled, setDisabled] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleHomePanel = () => {
        navigation.navigate('HomePanel')
    }

    const storeToken = async (token: string) => {
        try {
            await AsyncStorage.setItem('token', token)
        } catch (exp) {
            throw exp
        }
    }
    const handleSignIn = async () => {
        if (!password) {
            setErr('Password is required')
            return
        }
        setErr('')
        const loginRequest = {email: email, password: password}
        try {
            setLoading(true)

            const loginResponse = await login(loginRequest)
            if (loginResponse.ok) {
                setDisabled(true)
                const data = await loginResponse.json()

                const token = data.token
                await storeToken(token)

                const message = data.message
                const user = data.user
                Toast.show({
                    type: 'success',
                    text1: message,
                    onHide: () => {
                        setDisabled(false)
                        dispatch(setUserInfo(user))
                        /*debug the below line becoz when I try to use NavigationProp, I cannot use replace method of navigation but when I use StackNavigationProp,
                        I can use but the screen refreshes */
                        navigation.replace('CareerHub')
                    }
                })
            } else {
                const message = await loginResponse.text()
                setErr(message)
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
                    <Text style={[styles.headerText, {marginVertical: 16}]}>Welcome back to Job Bazaar</Text>
                    <View style={{marginVertical: 12}}>
                        <Text style={styles.textCentered}>Sign into your account as</Text>
                        <Text style={[styles.textCentered, {
                            fontSize: 14,
                            fontWeight: "bold",
                            marginTop: 4
                        }]}>{email}</Text>
                    </View>
                    <TouchableOpacity disabled={disabled} onPress={() => handleHomePanel()}>
                        <Text style={[styles.textCentered, styles.differentEmail, {marginVertical: 12}]}>Sign in with a
                            different email.</Text>
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.labelText}>Password</Text>
                        <TextInput editable={!disabled} secureTextEntry={true}
                                   style={styles.passwordInput}
                                   onChangeText={setPassword}/>
                        {err && <Text style={styles.errorMessage}>{err}</Text>}
                        <TouchableOpacity disabled={disabled} onPress={() => handleSignIn()}>
                            {
                                loading ?
                                    <ActivityIndicator size="small" color="#367c2b" style={styles.signInButton}/> :
                                    <Text style={styles.signInButton}>Sign In</Text>
                            }
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity disabled={disabled}
                                      onPress={() => navigation.navigate('ResetPassword')}>
                        <Text style={[styles.differentEmail, styles.textCentered, {marginTop: 18}]}>Forgot
                            Password</Text>
                    </TouchableOpacity>
                </View>
                <Toast/>
            </View>
        </TouchableWithoutFeedback>
    )
}
const styles = StyleSheet.create({
        parentContainer: {
            flex: 0.9,
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
            flex: 0.68,
            borderWidth: 1,
            borderRadius: 12,
            padding: 24,
            borderColor: "white",
            backgroundColor: "white",
            width: 300,
        },
        mainText: {
            textAlign: "center",
            color: "#367c2b",
            fontSize: 28,
            fontWeight: "bold",
            paddingHorizontal: 20,
            paddingVertical: 20,
        },
        textCentered: {
            textAlign: "center",
            fontSize: 18,
        },
        signInButton: {
            width: 250,
            padding: 8,
            borderWidth: 1,
            borderRadius: 6,
            marginTop: 16,
            fontSize: 18,
            color: "#367c2b",
            fontWeight: "bold",
            borderColor: "#367c2b",
            textAlign: "center",
        },
        passwordInput: {
            width: 250,
            height: 40,
            borderRadius: 6,
            borderWidth: 1,
            padding: 6,
            fontSize: 18,
            fontWeight: "bold",
            paddingTop: 8,
        },
        differentEmail: {
            color: "#367c2b",
            fontSize: 17,
            fontWeight: "bold"
        },
        errorMessage: {
            fontSize: 18,
            textAlign: "left",
            borderWidth: 1,
            borderRadius: 4,
            borderColor: "#ffebe8",
            backgroundColor: "#ffebe8",
            marginTop: 8,
            width: 250,
            padding: 5
        },
        labelText: {
            fontSize: 18,
            marginVertical: 8,
            marginTop: 8,
            marginLeft: 4
        }
    }
)
export default LoginPanel