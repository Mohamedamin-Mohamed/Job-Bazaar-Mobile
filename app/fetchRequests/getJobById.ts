import AsyncStorage from "@react-native-async-storage/async-storage";

const getJobById = async (employerEmail: string, jobId: string, controller: AbortController) => {
    const token = await AsyncStorage.getItem('token')
    if (!token) {
        throw new Error('No token wa found')
    }
    return await fetch(`http:localhost:8080/api/jobs/${employerEmail}/${jobId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
    })
}
export default getJobById