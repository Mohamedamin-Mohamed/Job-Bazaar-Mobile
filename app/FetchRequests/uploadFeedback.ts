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
        throw new Error('Token not found');
    }

    const url = process.env.EXPO_PUBLIC_BACKEND_URL
    return await fetch(`${url}/api/provide-feedback/`, {
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