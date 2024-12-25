import AsyncStorage from "@react-native-async-storage/async-storage";

interface RequestBody {
    applicantEmail: string,
    jobId: string,
    feedbackDate: string,
    feedback: string,
    status: string
}

const uploadFeedback = async (requestBody: RequestBody, controller: AbortController) => {
    const token = await AsyncStorage.getItem('token')
    if (!token) {
        throw new Error('No token available')
    }
    return await fetch('http://192.168.1.252:8080/api/provide-feedback/', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
    })
}
export default uploadFeedback