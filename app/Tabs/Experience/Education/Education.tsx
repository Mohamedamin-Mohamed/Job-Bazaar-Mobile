import {ActivityIndicator, Image, StyleSheet, Text, View} from "react-native";
import getEducation from "@/app/fetchRequests/getEducation";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Education as EducationType, RootStackParamList, RootState} from "@/app/Types/types";
import Icon from "react-native-vector-icons/MaterialIcons";
import imageSearch from "@/app/fetchRequests/imageSearch";
import {format} from "date-fns";
import {StackScreenProps} from "@react-navigation/stack";

type NavigationProp = StackScreenProps<RootStackParamList, 'Experience'>

const Education = ({navigation}: NavigationProp) => {
    const [education, setEducation] = useState<EducationType | null>(null)
    const [imgUrl, setImgUrl] = useState<string | null>(null)
    const [err, setErr] = useState('')
    const [loading, setLoading] = useState(false)
    const applicantEmail = useSelector((state: RootState) => state.userInfo).email

    const fetchEducationWorkExp = async (controller: AbortController) => {
        setLoading(true)
        try {
            const educationResponse = await getEducation(applicantEmail, controller)
            if (educationResponse.ok) {
                const educationData = await educationResponse.json()
                setEducation(educationData)
            }
        } catch (err) {
            console.error("Couldn't fetch education, ", err)
        } finally {
            setLoading(false)
        }
    }

    const fetchImageUrl = async (controller: AbortController) => {
        setLoading(true);
        try {
            const response = await imageSearch(`${education?.school} school logo`, controller);
            if (response.ok) {
                const dataJson = await response.json();
                const data = dataJson.data;
                if (data?.items && data.items.length > 0) {
                    setImgUrl(data.items[7].link); // Use the first item
                    setErr(''); // Clear any previous error
                } else {
                    setImgUrl(null);  // If no image is found, set to null
                    setErr('No image found for this company');
                }
            } else {
                setImgUrl(null);  // Handle API response error
                setErr('Error fetching company logo');
            }
        } catch (err) {
            console.error(err);
            setImgUrl(null);  // Fallback to no image
            setErr("Error fetching company logo.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController()
        fetchEducationWorkExp(controller).catch(err => console.error(err))
        fetchImageUrl(controller).catch(err => console.error(err))
        return () => {
            controller.abort()
        }
    }, []);

    const formatDate = () => {
        const currDate = new Date()
        return format(currDate, 'MM-yyy')
    }
    return (
        education && !loading ?
            <View style={styles.container}>
                <View>
                    <View style={[education && styles.educationPresent]}>
                        <Text style={styles.heading}>Education</Text>
                        {education && (
                            <View style={styles.icon}>
                                <Icon name="delete" size={24} color="gray"/>
                                <Icon name="edit" size={24} color="gray"/>
                            </View>
                        )}
                    </View>
                    {!education &&
                        < View style={styles.childContainer}>
                            <Text>
                                The education on the resume that you upload to Career Hub is imported into this
                                section of your profile. You can manually edit information in this section.
                            </Text>
                        </View>
                    }
                </View>
                <View style={styles.details}>
                    {imgUrl && <Image source={{uri: imgUrl}} alt={err} style={styles.image}/>}
                    <View style={styles.educationDetails}>
                        <Text style={[styles.detailsHeader, imgUrl && {width: "62%"}]}>{education?.school}</Text>
                        <Text
                            style={[styles.text, imgUrl && {width: "62%"}]}>{education?.degree}, {education?.major}</Text>
                        <Text
                            style={styles.text}>{education?.startDate} {'->'} {education?.endDate === formatDate() ? "Current" : education?.endDate}</Text>
                    </View>
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
        paddingHorizontal: 30,
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
        flexDirection: "row",
        gap: 20
    },
    image: {
        width: 100,
        height: 100
    },
    educationDetails: {
        justifyContent: "center",
        gap: 8
    },
    detailsHeader: {
        fontWeight: "500",
        fontSize: 20,
    },
    text: {
        color: "#6b7280",
        fontWeight: "bold",
        fontSize: 18,
    }
});

export default Education;
