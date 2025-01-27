import AsyncStorage from "@react-native-async-storage/async-storage";

const getFeedbacks = async (applicantEmail: string, controller: AbortController) => {
    const token = await AsyncStorage.getItem('token')
    if (!token) {
        throw new Error('Token not found');
    }

    const url = process.env.EXPO_PUBLIC_BACKEND_URL
    return await fetch(`${url}/api/feedbacks/applicant/${applicantEmail}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
    })
}
export default getFeedbacks