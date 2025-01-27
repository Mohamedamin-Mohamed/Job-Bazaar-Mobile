import React, {useEffect, useState} from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {NavigationProp} from "@react-navigation/core";
import {RootStackParamList, RootState} from "@/Types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import validateToken from "@/app/FetchRequests/validateToken";
import Toast from "react-native-toast-message";
import {useSelector} from "react-redux";

const LandingPanel = ({navigation}: { navigation: NavigationProp<RootStackParamList, 'Landing'> }) => {
    const image = require('../Images/b.png')

    const [disabled, setDisabled] = useState(false)
    const userInfo = useSelector((state: RootState) => state.userInfo)
    const showErrorToast = (message: string) => {
        Toast.show({
            type: 'error',
            text1: message,
            onShow: () => setDisabled(true),
            onHide: () => setDisabled(false)
        });
    };

    const isUserInfoComplete = (userInfo: Record<string, string>): boolean => {
        return Object.values(userInfo).every(value => value !== '');
    }

    const fetchAndValidateToken = async (): Promise<void> => {
        try {
            // Step 1: Fetch token
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                return;
            }

            // Step 2: Validate token
            const response = await validateToken(token);
            if (!response.ok) {
                showErrorToast('Token expired, please login again');
                return;
            }

            // Step 3: Check user info and navigate if complete
            if (isUserInfoComplete(userInfo)) {
                navigation.navigate("CareerHub");
            }
        } catch (error) {
            showErrorToast(
                error instanceof Error ? error.message : 'An unexpected error occurred');
        }
    };

    useEffect(() => {
        return navigation.addListener('focus', () => {
            fetchAndValidateToken().catch(err => {
                console.error(err);
            });
        });
    }, [navigation]);
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your work people are here</Text>
            <Image source={image} style={styles.image}/>
            <Text style={styles.title}>Welcome to Job Bazaar!</Text>
            <Text>Platform that connects employers with job applicants for seamless hiring opportunities.</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    disabled={disabled}
                    style={[styles.button, styles.managementButton]}
                    onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.buttonText}>Lets get started</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    disabled={disabled}
                    style={[styles.button, styles.postJobButton]}
                    onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.buttonText}>I already have an account</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 0.9,
        padding: 20,
        backgroundColor: '#f9f9f9',
        gap: 24,
    },
    parentView: {
        justifyContent: "space-between",
        flexDirection: "row"
    },
    mainText: {
        textAlign: "center",
        color: "#367c2b",
        fontSize: 28,
        fontWeight: "bold",
        paddingHorizontal: 20,
    },
    header: {
        color: "#367c2b",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 25,
        paddingTop: 20,
    },
    image: {
        width: "92%",
        resizeMode: "contain"
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    message: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
    },
    instruction: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        width: '100%',
        gap: 10,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    managementButton: {
        backgroundColor: '#367c2b',
    },
    postJobButton: {
        backgroundColor: '#0875e1',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
export default LandingPanel