import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RootStackParamList} from '@/app/Types/types';
import {NativeStackScreenProps} from "@react-navigation/native-stack";

type NoApplicantsRouteProp = NativeStackScreenProps<RootStackParamList, 'ViewApplicants'>;

const NoApplicants = ({navigation}: NoApplicantsRouteProp) => {

    const resetToManagementHub = () => {
        navigation.pop(2)
    };

    const resetToPostJob = () => {
        navigation.pop(3)
        navigation.navigate('UploadJob')
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>No Applicants Found</Text>
            <Text style={styles.message}>It seems there are no applicants for your job posting yet.</Text>
            <Text style={styles.instruction}>
                Don't worry! You can wait for more applicants, or review your job listing.
            </Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.managementButton]}
                    onPress={resetToManagementHub}>
                    <Text style={styles.buttonText}>Back to Management Hub</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.postJobButton]}
                    onPress={resetToPostJob}>
                    <Text style={styles.buttonText}>Post a New Job</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
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

export default NoApplicants;
