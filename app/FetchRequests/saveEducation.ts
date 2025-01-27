import AsyncStorage from "@react-native-async-storage/async-storage";

interface EducationRequest {
    email: string
    school: string,
    degree: string,
    major: string,
    startDate: string,
    endDate: string,
}

const saveEducation = async (postRequest: EducationRequest) => {
    const token = await AsyncStorage.getItem("token")
    if (!token) {
        throw new Error('Token not found');
    }

    const url = process.env.EXPO_PUBLIC_BACKEND_URL
    return await fetch(`${url}/api/user-education/save`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postRequest),
    })
}
export default saveEducation
