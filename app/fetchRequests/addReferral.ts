import AsyncStorage from "@react-native-async-storage/async-storage";

const addReferral = async (formData: FormData) => {
    const token = await AsyncStorage.getItem('token')
    if (!token) {
        throw new Error('No token available')
    }

    return await fetch('http://192.168.1.252:8080/api/referrals/add', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    })
}
export default addReferral