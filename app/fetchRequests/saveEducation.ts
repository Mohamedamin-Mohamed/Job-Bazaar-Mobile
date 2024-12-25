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
        throw new Error('No token available')
    }

    return await fetch('http://192.168.1.252:8080/api/user-education/save', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postRequest),
    })
}
export default saveEducation
