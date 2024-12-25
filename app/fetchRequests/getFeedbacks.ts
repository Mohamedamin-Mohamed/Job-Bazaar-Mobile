import AsyncStorage from "@react-native-async-storage/async-storage";

const getFeedbacks = async (applicantEmail: string, controller: AbortController) => {
    const token = await AsyncStorage.getItem('token')
    if (!token) {
        throw new Error('No token available')
    }

    return await fetch(`http://192.168.1.252:8080/api/feedbacks/applicant/${applicantEmail}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
    })
}
export default getFeedbacks