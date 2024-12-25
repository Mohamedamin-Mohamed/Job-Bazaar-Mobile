import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {Resume, RootStackParamList, RootState} from "../Types/types";
import * as DocumentPicker from "expo-document-picker"
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import referralFormData from "./referralFormData";
import addReferral from "../fetchRequests/addReferral";
import Toast from "react-native-toast-message";

type ReferNavigationProp = StackNavigationProp<RootStackParamList, 'Refer'>

const Refer = ({navigation}: { navigation: ReferNavigationProp }) => {
    const img = require('../Images/refer_illustration_cloud.png')
    const [disabled, setDisabled] = useState(false)
    const userInfo = useSelector((state: RootState) => state.userInfo)
    const [resumeDetails, setResumeDetails] = useState<Resume>({
        name: '',
        uri: '',
        type: ''
    })
    const navigateToAvailableJobs = () => {
        navigation.replace('AvailableJobs')
    }

    const resumeUpload = async () => {
        const result = await DocumentPicker.getDocumentAsync({type: "application/pdf"});

        if (!result.canceled) {
            const {name, uri, type} = result.assets.values().next().value;

            setResumeDetails(prevState => ({
                ...prevState,
                name,
                uri,
                type
            }));

            // Prepare form data based on updated resume details
            const formData = referralFormData({name, uri, type}, userInfo);

            addReferral(formData)
                .then(async (response) => {
                    const text = await response.text();
                    Toast.show({
                        type: response.ok ? 'success' : 'error',
                        text1: text,
                        onShow: () => setDisabled(true),
                        onHide: () => {
                            setDisabled(false);
                            response.ok && navigation.navigate('CareerHub');
                        }
                    });
                })
                .catch(error => console.error('Error adding referral:', error));
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerLeft: disabled ? () => null : undefined,
            gestureEnabled: !disabled
        })
    }, [navigation, disabled]);

    return (
        <View style={styles.container}>
            <View style={styles.childContainer}>
                <View style={styles.imageView}>
                    <Image source={img} style={styles.image}/>
                </View>
                <Text style={[styles.text, styles.button, {fontSize: 24}]}>Drop your friend's resume here</Text>
                <Text style={[styles.text]}>
                    To apply for the position, please upload your most recent resume here.
                    Make sure the resume reflects your latest skills, experience, and achievements to give us the best
                    view of your qualifications..</Text>
                <Text style={styles.text}>(pdf only)</Text>

                <View style={styles.parentButtonView}>
                    <TouchableOpacity style={styles.parentButton} onPress={() => resumeUpload()} disabled={disabled}>
                        <Text style={styles.button}>BROWSE FILES</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.text}>Or</Text>
                <View style={styles.parentButtonView}>
                    <TouchableOpacity style={[styles.parentButton, {width: 192, height: 36}]}
                                      onPress={() => navigateToAvailableJobs()} disabled={disabled}>
                        <Text style={styles.button}>Skip and Browse Jobs</Text>
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
        padding: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    childContainer: {
        width: "82%",
        borderWidth: 1,
        borderStyle: "dashed",
        borderRadius: 4,
        padding: 16,
        backgroundColor: "#2c8cc90a"
    },
    image: {
        width: 72,
        height: 52
    },
    imageView: {
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        textAlign: "center",
        marginVertical: 3,
        fontSize: 16
    },
    parentButtonView: {
        justifyContent: "center",
        alignItems: "center"
    },
    parentButton: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#367c2b",
        width: 144,
        height: 36,
        marginVertical: 10
    },
    button: {
        color: "#367c2b",
        fontSize: 16,
        fontWeight: "bold"
    }
})
export default Refer