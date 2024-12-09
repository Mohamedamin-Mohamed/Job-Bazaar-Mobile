import AsyncStorage from "@react-native-async-storage/async-storage";

const getEducation = async (applicantEmail: string, abortController: AbortController) => {
    const token = await AsyncStorage.getItem('token')
    if (!token) {
        throw new Error('No token available')
    }

    return await fetch(`http:localhost:8080/api/user-education/get/${applicantEmail}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        signal: abortController.signal
    })
}
export default getEducation
