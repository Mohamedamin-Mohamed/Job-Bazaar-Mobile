import AsyncStorage from "@react-native-async-storage/async-storage";

const getWorkExperience = async (applicantEmail: string, abortController: AbortController) => {
    const token = await AsyncStorage.getItem('token')
    if (!token) {
        throw new Error('No token available')
    }
    return await fetch(`http://192.168.1.252:8080/api/work-experience/get/${applicantEmail}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        signal: abortController.signal,
    })
}
export default getWorkExperience