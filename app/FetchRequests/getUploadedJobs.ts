import AsyncStorage from "@react-native-async-storage/async-storage";

const getUploadedJobs = async (employerEmail: string, controller: AbortController) => {
    const token = await AsyncStorage.getItem("token")
    if (!token) {
        throw new Error('Token not found');
    }

    const url = process.env.EXPO_PUBLIC_BACKEND_URL
    return await fetch(`${url}/api/jobs/employer/${employerEmail}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    })
}
export default getUploadedJobs