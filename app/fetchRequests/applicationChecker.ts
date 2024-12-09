import AsyncStorage from "@react-native-async-storage/async-storage";

const applicationChecker = async (applicantEmail: string, jobId: string, controller: AbortController) => {
    const token = await AsyncStorage.getItem('token')
    if (!token) {
        throw new Error('No token available')
    }
    return await fetch(`http://192.168.1.252:8080/api/applications/status?applicantEmail=${applicantEmail}&jobId=${jobId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
    })
}
export default applicationChecker