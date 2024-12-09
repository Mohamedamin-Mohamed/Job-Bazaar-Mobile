import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native"
import {useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {Picker} from "@react-native-picker/picker";
import usePreventRemove from "@react-navigation/core/src/usePreventRemove";
import emailValidation from "../Regex/emailValidation";
import signup from "../fetchRequests/signup";
import Toast from "react-native-toast-message";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../Types/types";

type Error = {
    email: string,
    password: string,
    names: string,
    role: string
}
type SignupNavigationProp = StackNavigationProp<RootStackParamList, 'Signup'>

const Signup = ({navigation}: { navigation: SignupNavigationProp }) => {
    const [userDetails, setUserDetails] = useState({
        email: '', firstName: '', lastName: '', role: '', password: ''
    })

    const [passwords, setPasswords] = useState({
        createPasswd: '', confirmPasswd: ''
    })
    const initialErrorInit: Error = {
        email: '', password: '', names: '', role: ''
    }
    const [err, setErr] = useState<Partial<Error>>(initialErrorInit)
    const [selectedVal, setSelectedVal] = useState('')
    const [disabled, setDisabled] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleUserDetails = (name: string, value: string) => {
        setUserDetails(prevState => ({
            ...prevState, [name]: value
        }))
    }

    const handlePasswords = (name: string, value: string) => {
        setPasswords(prevState => ({
            ...prevState, [name]: value
        }))
    }

    //keeps track of the current state of the form
    const hasNonEmptyValue = Object.values(userDetails).some(value => value) || Object.values(passwords).some(value => value) || selectedVal

    usePreventRemove(Boolean(hasNonEmptyValue), ({data}) => {
        Alert.alert('Discard Changes.', 'Are you sure you want to go back? You will lose all progress on this form.', [
            {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => {
                }
            },
            {
                text: 'Yes',
                style: "destructive",
                onPress: () => navigation.dispatch(data.action)
            }
        ])
    })

    const handleSignup = async () => {
        const emailValid = emailValidation(userDetails.email)

        let newErrors: Partial<Error> = {}
        if (!userDetails.email) {
            newErrors.email = 'Email is required'
        }
        if (userDetails.email && !emailValid) {
            newErrors.email = 'Email is not valid'
        }
        if (passwords.createPasswd !== passwords.confirmPasswd) {
            newErrors.password = "Password don't match"
        }
        if (passwords.createPasswd === passwords.confirmPasswd) {
            // Check if the password is at least 16 characters OR at least 8 characters including a number and a letter
            const hasLetter = /[a-zA-Z]/.test(passwords.createPasswd);
            const hasNumber = /[0-9]/.test(passwords.createPasswd);

            if (!(passwords.createPasswd.length >= 16 ||
                (passwords.createPasswd.length >= 8 && hasLetter && hasNumber))) {
                newErrors.password = 'Password must be at least 16 characters, or 8 characters with one number and one letter.';
            }
        }

        if (!userDetails.firstName || !userDetails.lastName) {
            newErrors.names = 'Both names are required'
        }
        if (!selectedVal) {
            newErrors.role = 'Role is required'
        }
        //now check if there are any errors
        if (Object.keys(newErrors).length > 0) {
            setErr(newErrors)
            return
        }
        //since there were no errors, set error object to the initial declared error object
        setErr(initialErrorInit)
        try {
            setLoading(true)
            const signResponse = await signup({...userDetails, password: passwords.confirmPasswd, role: selectedVal})
            const data = await signResponse.json()
            const message = data.message
            if (signResponse.ok) {
                Toast.show({
                    type: 'success',
                    text1: message,
                    onShow: () => setDisabled(true),
                    onHide: () => setDisabled(false)
                })
            } else {
                Toast.show({
                    type: 'error',
                    text1: message,
                    onShow: () => setDisabled(true),
                    onHide: () => setDisabled(false)
                })
            }
        } catch (exp) {
            console.error(exp)
        } finally {
            setLoading(true)
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.childContainer}>
                <Text style={styles.headerText}>Signup</Text>
                <TextInput editable={!disabled} style={styles.commonText} autoCapitalize="none" keyboardType="default"
                           placeholder="Email"
                           onChangeText={text => handleUserDetails('email', text)}
                           value={userDetails.email}/>
                {err.email && <Text style={styles.errorMessage}>{err.email}</Text>}
                <TextInput editable={!disabled} style={styles.commonText} autoCapitalize="none" keyboardType="default"
                           placeholder="First Name"
                           onChangeText={text => handleUserDetails('firstName', text)}
                           value={userDetails.firstName}/>
                <TextInput editable={!disabled} style={styles.commonText} autoCapitalize="none" keyboardType="default"
                           placeholder="Last Name"
                           onChangeText={text => handleUserDetails('lastName', text)}
                           value={userDetails.lastName}/>
                {err.names && <Text style={styles.errorMessage}>{err.names}</Text>}
                <TextInput editable={!disabled} style={styles.commonText} secureTextEntry={true} autoCapitalize="none"
                           keyboardType="default"
                           placeholder="Create Password"
                           onChangeText={text => handlePasswords('createPasswd', text)}
                           value={passwords.createPasswd}/>
                <TextInput editable={!disabled} style={styles.commonText} secureTextEntry={true} autoCapitalize="none"
                           keyboardType="default"
                           placeholder="Confirm Password"
                           onChangeText={text => handlePasswords('confirmPasswd', text)}
                           value={passwords.confirmPasswd}/>
                {err.password && <Text style={styles.errorMessage}>{err.password}</Text>}
                <View style={{height: 160}}>
                    <Picker enabled={!disabled} style={styles.pickerItems} mode="dropdown" selectedValue={selectedVal}
                            onValueChange={(itemValue, itemIndex) => setSelectedVal(itemValue)}>
                        <Picker.Item label="Select your role" value=""/>
                        <Picker.Item label="Employer" value="Employer"/>
                        <Picker.Item label="Applicant" value="Applicant"/>
                    </Picker>
                </View>
                {err.role && <Text style={[styles.errorMessage, {marginVertical: 10}]}>{err.role}</Text>}
                <TouchableOpacity disabled={disabled} onPress={handleSignup}>
                    {
                        loading ?
                            <ActivityIndicator size="small" color="#367c2b"
                                               style={[styles.commonText, styles.addedStyling]}/> :
                            <Text style={[styles.commonText, styles.addedStyling]}>Sign Up</Text>
                    }
                </TouchableOpacity>
                <View style={{display: "flex", justifyContent: "center", flexDirection: "row",}}>
                    <Text style={{fontSize: 17, marginRight: 10, paddingTop: 3, marginVertical: 8}}>Already have an
                        account?</Text>
                    <TouchableOpacity disabled={disabled} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginButton}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Toast/>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20
    },
    childContainer: {
        borderWidth: 1,
        borderRadius: 6,
        borderColor: "white",
        paddingVertical: 20,
        paddingHorizontal: 10,
        backgroundColor: "white"
    },
    headerText: {
        textAlign: "center",
        fontSize: 24,
        color: "#367c2b",
        fontWeight: "bold",
        marginBottom: 10
    },
    commonText: {
        width: 250,
        padding: 8,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 6,
        margin: 7,
        fontSize: 18,
        color: "#00060c",
    },
    loginButton: {
        fontSize: 18,
        color: "#367c2b",
        fontWeight: "bold",
        marginTop: 9
    },
    pickerItems: {
        height: 150
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
    addedStyling: {
        color: "#367c2b",
        fontWeight: "bold",
        borderColor: "#367c2b",
        textAlign: "center",
        fontSize: 20
    }
})
export default Signup
