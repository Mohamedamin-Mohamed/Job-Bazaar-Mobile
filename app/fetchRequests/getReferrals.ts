import AsyncStorage from "@react-native-async-storage/async-storage";

const getReferrals = async (referrerEmail: string, controller: AbortController) => {
    const token = await AsyncStorage.getItem('token')
    if (!token) {
        throw new Error('No token available')
    }
    return await fetch(`http:localhost:8080/api/referrals/get-referrals/${referrerEmail}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
    })
}
export default getReferrals