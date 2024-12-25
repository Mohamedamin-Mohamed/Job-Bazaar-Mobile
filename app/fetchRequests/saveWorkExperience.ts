import AsyncStorage from "@react-native-async-storage/async-storage";

interface WorkExpCreation {
    email: string,
    title: string
    company: string,
    location: string,
    startDate: string,
    endDate: string,
}

const saveWorkExperience = async (postRequest: WorkExpCreation) => {
    const token = await AsyncStorage.getItem("token")
    if (!token) {
        throw new Error('No token available')
    }
    return await fetch('http://192.168.1.252:8080/api/work-experience/save', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postRequest),
    })
}
export default saveWorkExperience