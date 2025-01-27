import {ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useState} from "react";
import AddEducation from "@/app/Modals/AddEducation";
import {Education as EducationType, RootState} from "@/Types/types";
import getEducation from "@/app/fetchRequests/getEducation";
import {useSelector} from "react-redux";

const Studies = () => {
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [education, setEducation] = useState<EducationType | null>(null)
    const applicantEmail = useSelector((state: RootState) => state.userInfo).email
    const image = require('../../Images/education.png')

    const handleModalDisplay = () => {
        setShowModal(prevState => !prevState)
    }

    const fetchEducation = async (controller: AbortController) => {
        setLoading(true)
        try {
            const educationResponse = await getEducation(applicantEmail, controller)
            if (educationResponse.ok) {
                const educationData = await educationResponse.json()
                setEducation(educationData)
            }
        } catch (err) {

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const controller = new AbortController();
        fetchEducation(controller).catch(err => console.error(err));
        return () => controller.abort();
    }, []);

    const handleEducation = () => {
        setEducation(null)
    }
    return (
        !loading ?
            <View style={styles.container}>
                <View style={styles.headerView}>
                    <Text style={styles.headerText}>Show what you’ve learned</Text>
                    <Image source={image} style={styles.image}/>
                </View>
                <Text style={styles.normalText}>Enter your school, major and degree so your teammates get to know more
                    about
                    you.</Text>
                <TouchableOpacity style={styles.uploadView} disabled={education !== null}
                                  onPress={() => handleModalDisplay()}>
                    <Text>Add Education</Text>
                </TouchableOpacity>
                {showModal && !education && <AddEducation handleModalDisplay={handleModalDisplay} education={null}
                                                          handleEducation={handleEducation}/>}
            </View>
            : <ActivityIndicator size="large" color="##67c2b"/>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        borderWidth: 0.2,
        borderRadius: 4,
        borderColor: "gray",
        padding: 10,
    },
    headerView: {
        flexDirection: "row"
    },
    headerText: {
        fontSize: 16,
        fontWeight: "500",
        width: "60%"
    },
    image: {
        width: 64,
        height: 64,
        marginLeft: "auto"
    },
    normalText: {
        fontSize: 14,
        marginVertical: 20
    },
    uploadView: {
        width: 140,
        height: 36,
        borderRadius: 3,
        backgroundColor: "#ffde00",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20
    },
})
export default Studies