import AsyncStorage from "@react-native-async-storage/async-storage";

const getAppliedJobs = async (applicantEmail: string, controller: AbortController) => {
    const token = await AsyncStorage.getItem('token')
    if (!token) throw new Error('No token available')
    return fetch(`http:localhost:8080/api/applications/users/${applicantEmail}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
    })
}
export default getAppliedJobs