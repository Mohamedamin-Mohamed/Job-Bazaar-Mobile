import {
    ActivityIndicator,
    Alert,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import {useRef, useState} from "react";
import {usePreventRemove} from "@react-navigation/native";
import {Picker} from "@react-native-picker/picker";
import emailValidation from "../Regex/emailValidation";
import signup from "../fetchRequests/signup";
import Toast from "react-native-toast-message";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "@/Types/types";

type SignupNavigationProp = StackNavigationProp<RootStackParamList, "Signup">;

const Signup = ({navigation}: { navigation: SignupNavigationProp }) => {
    const signupCompletedRef = useRef(false)
    const [userDetails, setUserDetails] = useState({
        email: "",
        firstName: "",
        lastName: "",
        role: "",
        password: "",
    });

    const [passwords, setPasswords] = useState({
        createPasswd: "",
        confirmPasswd: "",
    });

    const [selectedVal, setSelectedVal] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUserDetails = (name: string, value: string) => {
        setUserDetails((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handlePasswords = (name: string, value: string) => {
        setPasswords((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    usePreventRemove(!signupCompletedRef.current && Boolean(Object.values(userDetails).some((value) => value)) && !loading, ({data}) => {
        Alert.alert(
            "Discard Changes.",
            "Are you sure you want to go back? You will lose all progress on this form.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Yes",
                    style: "destructive",
                    onPress: () => navigation.dispatch(data.action),
                },
            ]
        );
    });

    const isEmailValid = (email: string) => emailValidation(email);

    const isPasswordValid = (password: string) => {
        return (
            password.length >= 16 ||
            (password.length >= 8 &&
                /[a-zA-Z]/.test(password) &&
                /[0-9]/.test(password))
        );
    };

    const checkIfMissingFields = () => {
        if (!userDetails.email || !isEmailValid(userDetails.email)) {
            Toast.show({
                type: "error",
                text1: "Invalid or missing email.",
                onShow: () => setDisabled(true),
                onHide: () => setDisabled(false)
            });
            return true;
        }
        if (!userDetails.firstName || !userDetails.lastName) {
            Toast.show({
                type: "error",
                text1: "First and last names are required.",
                onShow: () => setDisabled(true),
                onHide: () => setDisabled(false)
            });
            return true;
        }
        if (passwords.createPasswd !== passwords.confirmPasswd) {
            Toast.show({
                type: "error",
                text1: "Passwords do not match.",
                onShow: () => setDisabled(true),
                onHide: () => setDisabled(false)
            });
            return true;
        }
        if (!selectedVal) {
            Toast.show({
                type: "error",
                text1: "Role selection is required.",
                onShow: () => setDisabled(true),
                onHide: () => setDisabled(false)
            });
            return true;
        }
        if (!isPasswordValid(passwords.createPasswd)) {
            Toast.show({
                type: "error",
                text1: "16+ chars or 8+ (letters & numbers).",
                onShow: () => setDisabled(true),
                onHide: () => setDisabled(false)
            });
            return true;
        }
        return false;
    };

    const handleSignup = async () => {
        if (checkIfMissingFields()) return;

        try {
            setLoading(true);

            const signResponse = await signup(
                {
                    ...userDetails,
                    password: passwords.confirmPasswd,
                    role: selectedVal,
                },
                new AbortController()
            );

            if (signResponse.ok) {
                try {
                    const data = await signResponse.json();
                    const message = data?.message || "Signup successful!";

                    // mark signup as completed before showing toast
                    signupCompletedRef.current = true;

                    Toast.show({
                        type: "success",
                        text1: message,
                        text2: "Redirecting to login",
                        onHide: () => {
                            navigation.replace("Login");
                        },
                    });
                } catch (jsonError) {
                    console.error("Error parsing success response JSON:", jsonError);
                    Toast.show({
                        type: "error",
                        text1: "Signup was successful, but an issue occurred. Please log in.",
                    });
                }
            } else {
                try {
                    const responseText = await signResponse.text();
                    let data: { message?: string } | null;

                    try {
                        data = JSON.parse(responseText);
                    } catch {
                        data = null;
                    }

                    const errorMessage = data?.message || "Signup failed. Please try again.";

                    signupCompletedRef.current = true;
                    const toastType = data ? "error" : "success";
                    const toastMessage = data ? errorMessage : "Account created please login.";
                    const toastSubtitle = data ? "Redirecting to login" : "";

                    Toast.show({
                        type: toastType,
                        text1: toastMessage,
                        text2: toastSubtitle,
                        onHide: () => {
                            navigation.replace("Login");
                        },
                    });
                } catch (err) {
                    console.error(err);
                }
            }
        } catch (error) {
            console.error("Signup error:", error);
            Toast.show({
                type: "error",
                text1: "Something went wrong. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.childContainer}>
                    <Text style={styles.headerText}>Signup</Text>
                    <TextInput
                        editable={!disabled}
                        style={styles.commonText}
                        autoCapitalize="none"
                        keyboardType="default"
                        placeholder="Email"
                        onChangeText={(text) => handleUserDetails("email", text)}
                        value={userDetails.email}/>
                    <TextInput
                        editable={!disabled}
                        style={styles.commonText}
                        autoCapitalize="none"
                        keyboardType="default"
                        placeholder="First Name"
                        onChangeText={(text) => handleUserDetails("firstName", text)}
                        value={userDetails.firstName}/>
                    <TextInput
                        editable={!disabled}
                        style={styles.commonText}
                        autoCapitalize="none"
                        keyboardType="default"
                        placeholder="Last Name"
                        onChangeText={(text) => handleUserDetails("lastName", text)}
                        value={userDetails.lastName}/>
                    <TextInput
                        editable={!disabled}
                        style={styles.commonText}
                        secureTextEntry={true}
                        autoCapitalize="none"
                        keyboardType="default"
                        placeholder="Create Password"
                        onChangeText={(text) => handlePasswords("createPasswd", text)}
                        value={passwords.createPasswd}/>
                    <TextInput
                        editable={!disabled}
                        style={styles.commonText}
                        secureTextEntry={true}
                        autoCapitalize="none"
                        keyboardType="default"
                        placeholder="Confirm Password"
                        onChangeText={(text) => handlePasswords("confirmPasswd", text)}
                        value={passwords.confirmPasswd}/>
                    <View style={styles.pickerView}>
                        <Picker
                            enabled={!disabled}
                            style={styles.pickerItems}
                            mode="dropdown"
                            selectedValue={selectedVal}
                            onValueChange={(itemValue) =>
                                setSelectedVal(itemValue)
                            }>
                            <Picker.Item
                                label="Select your role"
                                value=""/>
                            <Picker.Item
                                label="Employer"
                                value="Employer"/>
                            <Picker.Item
                                label="Applicant"
                                value="Applicant"/>
                        </Picker>
                    </View>
                    <TouchableOpacity disabled={disabled} onPress={handleSignup}>
                        {loading ? (
                            <ActivityIndicator size="small" color="#367c2b"
                                               style={[styles.commonText, styles.addedStyling]}/>
                        ) : (
                            <Text style={[styles.commonText, styles.addedStyling,]}>Sign Up</Text>)}
                    </TouchableOpacity>
                    <View style={styles.accountView}>
                        <Text style={styles.accountText}>Already have an account?</Text>
                        <TouchableOpacity disabled={disabled} onPress={() => navigation.replace("Login")}>
                            <Text style={styles.loginButton}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Toast/>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    childContainer: {
        borderWidth: 1,
        borderRadius: 6,
        borderColor: "white",
        paddingVertical: 20,
        paddingHorizontal: 10,
        backgroundColor: "white",
    },
    headerText: {
        textAlign: "center",
        fontSize: 24,
        color: "#367c2b",
        fontWeight: "bold",
        marginBottom: 10,
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
        marginTop: 9,
        textDecorationLine: "underline"
    },
    pickerView: {
        height: 160
    },
    pickerItems: {
        height: 150,
    },
    addedStyling: {
        color: "#367c2b",
        fontWeight: "bold",
        borderColor: "#367c2b",
        textAlign: "center",
        fontSize: 20,
    },
    accountView: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "row",
    },
    accountText: {
        fontSize: 17,
        marginRight: 10,
        paddingTop: 3,
        marginVertical: 8,
    }
});
export default Signup;