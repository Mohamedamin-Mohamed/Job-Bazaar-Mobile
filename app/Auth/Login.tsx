import {
    ActivityIndicator,
    Alert,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {useRef, useState} from "react";
import {usePreventRemove} from "@react-navigation/native";
import emailValidation from "../Regex/emailValidation";
import login from "@/app/FetchRequests/login";
import Toast from 'react-native-toast-message'
import {useDispatch} from "react-redux";
import {setUserInfo} from "../Redux/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {RootStackParamList} from "@/Types/types";
import {StackNavigationProp} from "@react-navigation/stack";

interface Error {
    email: string,
    password: string
}

type LoginNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>

const Login = ({navigation}: { navigation: LoginNavigationProp }) => {
    const loginCompletedRef = useRef(false)
    const dispatch = useDispatch()
    const [loginDetails, setLoginDetails] = useState({
        email: '', password: ''
    })
    const [disabled, setDisabled] = useState(false)
    const [loading, setLoading] = useState(false)
    const initialError: Error = {email: '', password: ''}
    const [err, setErr] = useState<Partial<Error>>(initialError)
    const handleLoginDetailsChange = (name: string, value: string) => {
        setLoginDetails(prevState => ({
            ...prevState, [name]: value
        }))
    }

    usePreventRemove(!loginCompletedRef.current && Boolean(Object.values(loginDetails).some(some => some)) && !loading, ({data}) => {
        Alert.alert('Discard Login?', 'Are you sure you want to leave this page? Any information you’ve entered will be lost.', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: () => navigation.dispatch(data.action)
            }
        ])
    })

    const storeToken = async (token: string) => {
        try {
            await AsyncStorage.setItem('token', token)
        } catch (err) {
            console.error('Token could not be stored ', err)
        }
    }
    const handleLogin = async () => {
        if (!loginDetails.email) {
            setErr({email: 'Email is required'})
            return
        }
        if (!loginDetails.password) {
            setErr({password: 'Password is required'})
            return
        }

        const emailValid = emailValidation(loginDetails.email)
        if (!emailValid) {
            setErr({email: 'Email is not valid'})
            return
        }
        setErr(initialError)
        try {
            setLoading(true)
            const loginResponse = await login(loginDetails)
            //check if email is valid
            if (loginResponse.status === 404) {
                const message = await loginResponse.text()
                setErr({email: message})
            }
            //check if password is valid
            else if (loginResponse.status === 401) {
                const message = await loginResponse.text()
                setErr({password: message})
            }
            //if we reach here it means account is valid
            else {
                setLoginDetails({email: '', password: ''})
                const data = await loginResponse.json()

                const token = data.token
                await storeToken(token)

                const user = data.user
                dispatch(setUserInfo(user))

                const message = data.message

                // Set the ref before showing toast by marking login as completed
                loginCompletedRef.current = true;
                Toast.show({
                    type: 'success',
                    text1: message,
                    onShow: () => setDisabled(true),
                    onHide: () => {
                        setDisabled(false)
                        navigation.replace('CareerHub')
                    }
                })
            }
        } catch (exp) {
            console.error(exp)
        } finally {
            setLoading(false)
        }

    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Toast/>
                <View style={styles.childContainer}>
                    <Text style={styles.headerText}>Login</Text>
                    <TextInput editable={!disabled} autoCapitalize="none" style={styles.textInputs}
                               keyboardType="email-address"
                               placeholder="Email" onChangeText={text => handleLoginDetailsChange('email', text)}/>
                    {err.email && <Text style={styles.errorMessage}>{err.email}</Text>}
                    <TextInput editable={!disabled} autoCapitalize="none" style={styles.textInputs}
                               keyboardType="visible-password"
                               secureTextEntry={true}
                               placeholder="Password"
                               onChangeText={text => handleLoginDetailsChange('password', text)}/>
                    {err.password && <Text style={styles.errorMessage}>{err.password}</Text>}
                    <TouchableOpacity disabled={disabled} onPress={handleLogin}>
                        {
                            loading ? <ActivityIndicator size="small" color="#367c2b" style={styles.loginButton}/> :
                                <Text style={styles.loginButton}>Login</Text>
                        }
                    </TouchableOpacity>
                    <View style={styles.forgotPasswordContainer}>
                        <TouchableOpacity disabled={disabled} onPress={() => navigation.replace('ForgotPassword')}>
                            <Text style={styles.forgotPassword}>Forgot
                                Password</Text>
                        </TouchableOpacity>
                        <View style={styles.noAccount}>
                            <Text style={{fontSize: 16, marginTop: 2}}>Don't have an account?</Text>
                            <TouchableOpacity disabled={disabled} onPress={() => navigation.replace('Signup')}>
                                <Text style={styles.signupButton}>Signup</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 0.9,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    childContainer: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 24,
        borderColor: "white",
        backgroundColor: "white",
    },
    headerText: {
        textAlign: "center",
        fontSize: 24,
        color: "#367c2b",
        fontWeight: "bold",
        marginBottom: 10
    },
    textInputs: {
        width: 250,
        padding: 8,
        borderWidth: 1,
        borderRadius: 6,
        borderColor: "gray",
        margin: 7,
        fontSize: 18,
    },
    loginButton: {
        width: 250,
        height: 40,
        borderColor: "#367c2b",
        borderRadius: 6,
        borderWidth: 1,
        textAlign: "center",
        fontSize: 18,
        color: "#367c2b",
        fontWeight: "bold",
        paddingTop: 8,
        margin: 7
    },
    forgotPasswordContainer: {
        justifyContent: "center",
        alignItems: "center"
    },
    forgotPassword: {
        fontSize: 17,
        margin: 6,
        color: "#367c2b",
        fontWeight: "bold",
        textDecorationLine: "underline"
    },
    noAccount: {
        flexDirection: "row",
        padding: 4,
        margin: 4
    },
    socialsLogin: {
        marginVertical: 4,
        width: 250,
    },
    socialButton: {
        width: 250,
        height: 40,
        margin: 6,
        borderWidth: 1,
        borderRadius: 6,
        textAlign: "center",
        paddingTop: 8,
        fontSize: 19
    },
    errorMessage: {
        fontSize: 18,
        textAlign: "left",
        borderWidth: 1,
        borderRadius: 6,
        borderColor: "#fff1f0",
        backgroundColor: "#ffebe8",
        marginLeft: 6,
        width: 250,
        padding: 5
    },
    signupButton: {
        marginLeft: 8,
        color: "#367c2b",
        fontWeight: "bold",
        fontSize: 18,
        textDecorationLine: "underline"
    }
})
export default Login