import {ActivityIndicator, StyleSheet, Text, View, Image} from "react-native";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState, WorkExperience as WorkExperienceType} from "@/app/Types/types";
import getWorkExperience from "@/app/fetchRequests/getWorkExperience";
import Icon from "react-native-vector-icons/MaterialIcons";
import imageSearch from "@/app/fetchRequests/imageSearch";

const WorkExperience = () => {
    const [workExperience, setWorkExperience] = useState<WorkExperienceType | null>(null)
    const [imgUrl, setImgUrl] = useState()
    const [err, setErr] = useState('')
    const [loading, setLoading] = useState(false)
    const applicantEmail = useSelector((state: RootState) => state.userInfo).email

    const fetchEducationWorkExp = async (controller: AbortController) => {
        setLoading(true)
        try {
            const workExperienceResponse = await getWorkExperience(applicantEmail, controller);
            if (workExperienceResponse.ok) {
                const workExperienceData = await workExperienceResponse.json()
                setWorkExperience(workExperienceData)
            } else {
                console.error("Failed to fetch work experience:", workExperienceResponse.statusText)
            }
        } catch (err) {
            console.error("Couldn't fetch work experience, ", err)
        } finally {
            setLoading(false)
        }
    }

    const fetchImageUrl = async (controller: AbortController) => {
        setLoading(true)
        try {
            const response = await imageSearch('', controller)
            const dataJson = await response.json()
            const data = dataJson.data
            if (data.items && data.items.length > 0) {
                setImgUrl(data.items[7].link)
            } else {
                setErr('No images found')
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }

    }
    useEffect(() => {
        const controller = new AbortController()
        fetchEducationWorkExp(controller).catch(err => console.error(err))
        return () => {
            controller.abort()
        }
    }, []);

    return (
        !loading ?
            <View style={styles.container}>
                <View>
                    <View style={[workExperience && styles.educationPresent]}>
                        <Text style={styles.heading}>Work Experience</Text>
                        {workExperience && (
                            <View style={styles.icon}>
                                <Icon name="delete" size={24} color="gray"/>
                                <Icon name="edit" size={24} color="gray"/>
                            </View>
                        )}
                    </View>
                    {!workExperience &&
                        < View style={styles.childContainer}>
                            <Text>
                                The education on the resume that you upload to Career Hub is imported into this
                                section of
                                your profile. You can manually edit information in this section.
                            </Text>
                        </View>
                    }
                </View>
                <View style={styles.details}>
                    <Image source={imgUrl} style={styles.image}/>
                    <Text>{workExperience?.title}</Text>
                </View>
            </View>
            : <ActivityIndicator size="large" color="#367c2b"/>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        borderWidth: 0.4,
        borderRadius: 4,
        borderColor: "gray",
        marginVertical: 16,
        width: "92%",
        padding: 16,
        paddingHorizontal: 30, // Add some padding for better layout
    },
    childContainer: {
        borderWidth: 0.4,
        borderRadius: 4,
        borderColor: "gray",
        padding: 16,
        marginVertical: 20
    },
    heading: {
        fontSize: 18,
        fontWeight: "500",
        marginBottom: 20,
    },
    educationPresent: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    icon: {
        flexDirection: "row",
        gap: 16
    },
    details: {
        flexDirection: "row"
    },
    image: {
        width: 100,
        height: 100
    }
});

export default WorkExperience;
