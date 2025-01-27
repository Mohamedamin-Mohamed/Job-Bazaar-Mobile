import {Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {useState} from "react";
import {Picker} from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import signup from "@/app/FetchRequests/signup";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList, RootState} from "@/Types/types";
import {useSelector} from "react-redux";

type CreateAccountPanelProp = StackNavigationProp<RootStackParamList, 'CreateAccount'>

const CreateAccountPanel = ({navigation}: { navigation: CreateAccountPanelProp }) => {
    const email = useSelector((state: RootState) => state.userInfo.email)

    const [userDetails, setUserDetails] = useState({
        email: email, firstName: '', lastName: '', password: '', role: ''
    })
    const [disabled, setDisabled] = useState(false)
    const handleHomePanel = () => {
        navigation.navigate('HomePanel')
    }
    const handleUserDetails = (name: string, value: string) => {
        setUserDetails(prevState => ({
            ...prevState, [name]: value
        }))
    }
    const handleCreateAccount = async () => {
        const hasNoEmptyValue = Object.values(userDetails).every(value => value)
        if (!hasNoEmptyValue) {
            Toast.show({
                type: 'error',
                text1: 'Please fill out all the required fields',
                onShow: () => setDisabled(true),
                onHide: () => setDisabled(false),
            })
            return
        }

        try {
            const loginResponse = await signup(userDetails, new AbortController())
            const data = await loginResponse.json()
            const message = data.message
            if (loginResponse.ok) {
                Toast.show({
                    type: 'success',
                    text1: message,
                    onShow: () => setDisabled(true),
                    onHide: async () => {
                        setDisabled(false)
                        navigation.replace('Login')
                    },
                })
            } else {
                Toast.show({
                    type: 'error',
                    text1: message,
                    onShow: () => setDisabled(true),
                    onHide: () => {
                        setDisabled(false)
                        navigation.replace('Login')
                    },
                })
            }
        } catch (err) {
            console.error(err)
        }
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.parentContainer}>
                <View style={styles.childContainer}>
                    <Text style={[styles.headerText, {marginVertical: 8}]}>Welcome to Job Bazaar</Text>
                    <View style={{marginVertical: 12}}>
                        <Text style={styles.textCentered}>Create your account as</Text>
                        <Text style={[styles.textCentered, {
                            fontSize: 18,
                            fontWeight: "bold",
                            marginTop: 4
                        }]}>{email}</Text>
                    </View>
                    <TouchableOpacity disabled={disabled} onPress={() => handleHomePanel()}>
                        <Text style={[styles.textCentered, styles.differentEmail, {marginVertical: 12}]}>Register with a
                            different email.</Text>
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.labelsText}>First Name*</Text>
                        <TextInput editable={!disabled} style={styles.textInputs} keyboardType="default"
                                   onChangeText={text => handleUserDetails('firstName', text)}/>
                    </View>
                    <View>
                        <Text style={styles.labelsText}>Last Name*</Text>
                        <TextInput editable={!disabled} style={styles.textInputs} keyboardType="default"
                                   onChangeText={text => handleUserDetails('lastName', text)}/>
                    </View>
                    <View style={{height: 160}}>
                        <Picker enabled={!disabled} style={styles.pickerItems} selectedValue={userDetails.role}
                                onValueChange={(itemValue) => handleUserDetails('role', itemValue)}>
                            <Picker.Item label="Select your role*" value=""/>
                            <Picker.Item label="Employer" value="Employer"/>
                            <Picker.Item label="Applicant" value="Applicant"/>
                        </Picker>
                    </View>
                    <View>
                        <Text style={styles.labelsText}>Password*</Text>
                        <TextInput editable={!disabled} style={styles.textInputs} secureTextEntry={true}
                                   keyboardType="default" onChangeText={text => handleUserDetails('password', text)}/>
                    </View>
                    <TouchableOpacity disabled={disabled} onPress={() => handleCreateAccount()}>
                        <Text style={styles.createAccountButton}>Create Account</Text>
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
        flex: 0.85,
        borderWidth: 1,
        borderRadius: 12,
        padding: 24,
        borderColor: "white",
        backgroundColor: "white",
        width: 300,
    },
    textCentered: {
        textAlign: "center",
        fontSize: 18,
    },
    differentEmail: {
        color: "#367c2b",
        fontSize: 17,
        fontWeight: "bold",
        textDecorationLine: "underline"
    },
    pickerItems: {
        margin: 0
    },
    textInputs: {
        width: 250,
        padding: 8,
        borderWidth: 1,
        borderRadius: 6,
        borderColor: "gray",
        marginLeft: 4,
        marginVertical: 10,
        fontSize: 18,
    },
    labelsText: {
        fontSize: 17,
        marginTop: 4,
        marginLeft: 4
    },
    createAccountButton: {
        width: 250,
        padding: 8,
        borderWidth: 1,
        borderRadius: 6,
        marginTop: 14,
        marginLeft: 4,
        fontSize: 18,
        color: "#367c2b",
        fontWeight: "bold",
        borderColor: "#367c2b",
        textAlign: "center",
    },
})
export default CreateAccountPanel