import AsyncStorage from "@react-native-async-storage/async-storage";

const getUploadedJobs = async (employerEmail: string, controller: AbortController) => {
    const token = await AsyncStorage.getItem("token")
    if (!token) {
        throw new Error('No token available')
    }

    return await fetch(`http:localhost:8080/api/jobs/employer/${employerEmail}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
    })
}
export default getUploadedJobs