import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Referral} from "@/Types/types";
import {useState} from "react";
import ResumeViewer from "../Modals/ResumeViewer";

const ReferralItem = ({referral}: { referral: Referral }) => {
    const [showModal, setShowModal] = useState(false)

    const handleDisplayModel = () => {
        setShowModal(prevState => !prevState)
    }
    const resumeDetails = {
        resumeName: referral.fileName,
        resume: referral.resume
    }
    return (
        <View style={styles.card}>
            <View style={[styles.headerContainer, {flexDirection: 'row'}]}>
                <Text style={[styles.header, {fontSize: 14, marginRight: 10}]}>Referral Date:</Text>
                <Text style={styles.date}>{referral.createdAt}</Text>
            </View>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => setShowModal(!showModal)}>
                    <Text style={styles.resumeLink}>{referral.fileName}</Text>
                </TouchableOpacity>
            </View>
            {showModal && (
                <ResumeViewer handleDisplayModel={handleDisplayModel} resumeDetails={resumeDetails}/>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    headerContainer: {
        flexDirection: 'column', // Stack elements vertically inside the container
        marginBottom: 8,
    },
    header: {
        fontSize: 22,
        marginBottom: 8,
    },
    email: {
        color: '#007AFF',
        marginBottom: 8,
    },
    date: {
        fontSize: 14,
        color: '#8A8A8A',
        marginBottom: 8,
    },
    resumeLink: {
        color: '#367c2b',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ReferralItem;
