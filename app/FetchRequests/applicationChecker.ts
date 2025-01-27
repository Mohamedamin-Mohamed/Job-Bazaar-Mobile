import AsyncStorage from "@react-native-async-storage/async-storage";

const applicationChecker = async (applicantEmail: string, jobId: string, controller: AbortController) => {
    const token = await AsyncStorage.getItem('token')
    if (!token) {
        throw new Error('Token not found');
    }

    const url = process.env.EXPO_PUBLIC_BACKEND_URL
    return fetch(`${url}/api/applications/status?applicantEmail=${applicantEmail}&jobId=${jobId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
    })
}
export default applicationChecker