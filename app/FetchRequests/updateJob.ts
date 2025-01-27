import AsyncStorage from "@react-native-async-storage/async-storage";

const updateJob = async (employerEmail: string, jobId: string, jobStatus: string, controller: AbortController) => {
    const token = await AsyncStorage.getItem('token')
    if (!token) {
        throw new Error('Token not found');
    }

    const url = process.env.EXPO_PUBLIC_BACKEND_URL
    return await fetch(`${url}/api/jobs/update/${employerEmail}/${jobId}`, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({jobStatus: jobStatus}),
            signal: controller.signal
        }
    )

}
export default updateJob