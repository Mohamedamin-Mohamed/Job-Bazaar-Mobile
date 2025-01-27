import {ActivityIndicator, Image, StyleSheet, Text, View} from "react-native";
import getEducation from "@/app/fetchRequests/getEducation";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Education as EducationType, RootState, RootTabParamList} from "@/Types/types";
import Icon from "react-native-vector-icons/MaterialIcons";
import imageSearch from "@/app/fetchRequests/imageSearch";
import {format} from "date-fns";
import deleteEducation from "@/app/fetchRequests/deleteEducation";
import Toast from "react-native-toast-message";
import AddEducation from "@/app/Modals/AddEducation";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";

type NavigationProp = BottomTabScreenProps<RootTabParamList, 'Experience'>

const Education = ({navigation}: NavigationProp) => {
    const [education, setEducation] = useState<EducationType | null>(null)
    const [imgUrl, setImgUrl] = useState<string | null>(null)
    const fallBackImageUrl = require('../../../Images/COLOURBOX50538417.webp')
    const [loading, setLoading] = useState(false)
    const [displayModal, setDisplayModal] = useState(false)
    const applicantEmail = useSelector((state: RootState) => state.userInfo).email

    const fetchEducation = async (controller: AbortController) => {
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
                    setImgUrl(data.items[7].link);
                } else {
                    setImgUrl(null);

                }
            } else {
                setImgUrl(null);
            }
        } catch (err) {
            console.error(err);
            setImgUrl(null);  // Fallback to no image
        } finally {
            setLoading(false);
        }
    };


    const formatDate = () => {
        const currDate = new Date()
        return format(currDate, 'MM-yyy')
    }

    const handleDelete = async () => {
        const response = await deleteEducation(applicantEmail)
        const message = await response.text();
        const success = response.ok
        if (success) {
            setEducation(null)
        }
        Toast.show({
            type: success ? "success" : "error",
            text1: message,
            onHide: () => navigation.navigate('Experience')
        })
    }

    const handleModalDisplay = () => {
        setDisplayModal(prevState => !prevState)
    }

    const handleEducation = () => {
        setEducation(null)
    }

    useEffect(() => {
        if (!displayModal) {
            const controller = new AbortController();
            fetchEducation(controller).catch(err => console.error(err));
            return () => controller.abort();
        }
    }, [displayModal]);

    useEffect(() => {
        if (education?.school) {
            const controller = new AbortController()
            fetchImageUrl(controller).catch(err => console.error(err))
            return () => controller.abort()
        }
    }, [education]);

    return (
        !loading ?
            <View style={styles.container}>
                <Toast position="top"/>
                <View>
                    <View style={styles.iconsView}>
                        <Text style={styles.heading}>Education</Text>
                        {education ? (
                            <View style={styles.icon}>
                                <Icon name="delete" size={24} color="gray" onPress={() => handleDelete()}/>
                                <Icon name="edit" size={24} color="gray" onPress={() => handleModalDisplay()}/>
                            </View>
                        ) : <Icon name="add" size={24} color="gray" onPress={() => handleModalDisplay()}/>}
                    </View>
                    {!education &&
                        <View style={styles.childContainer}>
                            <Text>
                                The education on the resume that you upload to Career Hub is imported into this
                                section of your profile. You can manually edit information in this section.
                            </Text>
                        </View>
                    }
                </View>
                {education &&
                    <View style={styles.details}>
                        {imgUrl ? (
                            <Image source={{uri: imgUrl}} style={styles.image}/>
                        ) : (
                            <Image source={fallBackImageUrl} style={styles.image}/>
                        )}

                        <View style={styles.educationDetails}>
                            <Text style={styles.detailsHeader}>{education?.school}</Text>
                            <Text style={styles.text}>{education?.degree},</Text>
                            <Text style={styles.text}>{education?.major}</Text>
                            <Text
                                style={styles.text}>{education?.startDate} {'->'} {education?.endDate === formatDate() ? "Current" : education?.endDate}</Text>
                        </View>
                    </View>
                }
                {displayModal && <AddEducation handleModalDisplay={handleModalDisplay} education={education}
                                               handleEducation={handleEducation}/>}
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
        marginVertical: 20,
        padding: 16
    },
    heading: {
        fontSize: 18,
        fontWeight: "500",
        marginBottom: 20,
    },
    iconsView: {
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
        width: "40%",
        height: "38%"
    },
    educationDetails: {
        justifyContent: "center",
        gap: 8
    },
    detailsHeader: {
        fontWeight: "500",
        fontSize: 20,
        width: "60%"
    },
    text: {
        color: "#8A8A8A",
        fontSize: 18,
    }
});

export default Education;
