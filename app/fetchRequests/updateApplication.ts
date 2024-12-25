import AsyncStorage from "@react-native-async-storage/async-storage";

const updateApplication = async (applicantEmail: string, jobId: string, applicationStatus: string | null, controller: AbortController) => {
    const token = await AsyncStorage.getItem('token')
    if (!token) {
        throw new Error('No token available')
    }
    return await fetch(`http://192.168.1.252:8080/api/applications/updateApplicationStatus/${applicantEmail}/${jobId}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({applicationStatus: applicationStatus}),
        signal: controller.signal
    })
}
export default updateApplication
