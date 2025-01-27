import AsyncStorage from "@react-native-async-storage/async-storage";

const getWorkExperience = async (applicantEmail: string, abortController: AbortController) => {
    const token = await AsyncStorage.getItem('token')
    if (!token) {
        throw new Error('Token not found');
    }

    const url = process.env.EXPO_PUBLIC_BACKEND_URL
    return await fetch(`${url}/api/work-experience/get/${applicantEmail}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        signal: abortController.signal,
    })
}
export default getWorkExperience