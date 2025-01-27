import {ActivityIndicator, Image, StyleSheet, Text, View} from "react-native";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootStackParamList, RootState, WorkExperience as WorkExperienceType} from "@/Types/types";
import getWorkExperience from "@/app/fetchRequests/getWorkExperience";
import Icon from "react-native-vector-icons/MaterialIcons";
import imageSearch from "@/app/fetchRequests/imageSearch";
import {format} from "date-fns";
import Toast from "react-native-toast-message";
import deleteWorkExperience from "@/app/fetchRequests/deleteWorkExperience";
import AddWorkExperience from "@/app/Modals/AddWorkExperience";
import {StackNavigationProp} from "@react-navigation/stack";

const WorkExperience = ({navigation}: {navigation: StackNavigationProp<RootStackParamList, 'Experience'>}) => {
    const [workExperience, setWorkExperience] = useState<WorkExperienceType | null>(null);
    const [imgUrl, setImgUrl] = useState<string | null>(null);
    const fallBackImageUrl = require('../../Images/COLOURBOX50538417.webp')
    const [loading, setLoading] = useState(false);
    const [displayModal, setDisplayModal] = useState(false)
    const applicantEmail = useSelector((state: RootState) => state.userInfo).email;

    const fetchWorkExp = async (controller: AbortController) => {
        setLoading(true);
        try {
            const workExperienceResponse = await getWorkExperience(applicantEmail, controller);
            if (workExperienceResponse.ok) {
                const workExperienceData = await workExperienceResponse.json();
                setWorkExperience(workExperienceData);
            }
        } catch (err) {
        } finally {
            setLoading(false);
        }
    }

    const fetchImageUrl = async (controller: AbortController) => {
        setLoading(true);
        try {
            const response = await imageSearch(`${workExperience?.company} company logo`, controller);
            if (response.ok) {
                const dataJson = await response.json();
                const data = dataJson.data;
                if (data?.items && data.items.length > 0) {
                    setImgUrl(data.items[0].link);
                } else {
                    setImgUrl(null);
                }
            } else {
                setImgUrl(null);
            }
        } catch (err) {
            console.error(err);
            setImgUrl(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!displayModal) {
            const controller = new AbortController();
            fetchWorkExp(controller).catch(err => console.error(err))
            return () => controller.abort();
        }
    }, [displayModal]);

    useEffect(() => {
        if (workExperience?.company) {
            const controller = new AbortController();
            fetchImageUrl(controller).catch(console.error);
            return () => controller.abort();
        }
    }, [workExperience]);


    const formatDate = () => {
        const currDate = new Date();
        return format(currDate, 'MM-yyyy');
    };

    const handleDelete = async () => {
        try {
            const response = await deleteWorkExperience(applicantEmail)
            const message = await response.text();
            const success = response.ok
            if (success) {
                setWorkExperience(null)
            }
            Toast.show({
                type: success ? "success" : "error",
                text1: message,
                onHide: () => navigation.navigate('Experience')
            })
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleModalDisplay = () => {
        setDisplayModal(prevState => !prevState)
    }
    const handleWorkExperience = () => {
        setWorkExperience(null)
    }
    return (
        !loading ? (
            <View style={styles.container}>
                <Toast position="top"/>
                <View>
                    <View style={styles.iconsView}>
                        <Text style={styles.heading}>Work Experience</Text>
                        {workExperience ? (
                            <View style={styles.icon}>
                                <Icon name="delete" size={24} color="gray" onPress={() => handleDelete()}/>
                                <Icon name="edit" size={24} color="gray" onPress={() => handleModalDisplay()}/>
                            </View>
                        ) : <Icon name="add" size={24} color="gray" onPress={() => handleModalDisplay()}/>}
                    </View>
                    {!workExperience && (
                        <View style={styles.childContainer}>
                            <Text>
                                The work experience data is presented in the Profile Assistant for you
                                to insert into your profile. Additionally, this contains data on the resume that you
                                upload to Career Hub.
                            </Text>
                        </View>
                    )}
                </View>
                {workExperience &&
                    <View style={styles.details}>
                        {imgUrl ? (
                            <Image source={{uri: imgUrl}} style={styles.image}/>
                        ) : (
                            <Image source={fallBackImageUrl} style={styles.image}/>
                        )}

                        <View style={styles.workDetails}>
                            <Text style={styles.detailsHeader}>{workExperience?.title}</Text>
                            <Text style={styles.text}>{workExperience?.company}</Text>
                            <Text style={styles.text}>
                                {workExperience?.startDate} {'->'} {workExperience?.endDate === formatDate() ? "Current" : workExperience?.endDate}
                            </Text>
                        </View>
                    </View>
                }
                {displayModal &&
                    <AddWorkExperience handleModalDisplay={handleModalDisplay} workExperience={workExperience}
                                       handleWorkExperience={handleWorkExperience}/>}
            </View>
        ) : (
            <ActivityIndicator size="large" color="#367c2b"/>
        )
    );
};

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
    workDetails: {
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
    },

});

export default WorkExperience;
