import AsyncStorage from "@react-native-async-storage/async-storage";

const imageSearch = async (query: string, controller: AbortController) => {
    const token = await AsyncStorage.getItem('token')
    if (!token) {
        throw new Error('No token available')
    }
    return await fetch(`http://192.168.1.252:8080/api/fetch-image/imageUrl?query=${query}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
    })
}
export default imageSearch