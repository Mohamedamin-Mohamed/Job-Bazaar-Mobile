import AsyncStorage from "@react-native-async-storage/async-storage";

const getAvailableJobs = async (controller: AbortController) => {
    const token = await AsyncStorage.getItem('token')
    if (!token) {
        console.error('No token available')
        throw new Error('No token available')
    }

    return await fetch('http:localhost:8080/api/jobs/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
    })
}
export default getAvailableJobs