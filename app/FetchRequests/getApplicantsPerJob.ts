import AsyncStorage from "@react-native-async-storage/async-storage";

const getApplicantsPerJob = async (jobIds: string[], controller: AbortController) => {
    const token = await AsyncStorage.getItem('token')
    if (!token) {
        throw new Error('Token not found');
    }

    const url = process.env.EXPO_PUBLIC_BACKEND_URL
    return await fetch(`${url}/api/jobs/applicants-count`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobIds),
    })
}
export default getApplicantsPerJob