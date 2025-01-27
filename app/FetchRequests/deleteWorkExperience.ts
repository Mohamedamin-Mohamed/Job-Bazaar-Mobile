import AsyncStorage from "@react-native-async-storage/async-storage";

const deleteWorkExperience = async (applicantEmail: string) => {
    const token = await AsyncStorage.getItem('token')
    if (!token) {
        throw new Error('Token not found');
    }

    const url = process.env.EXPO_PUBLIC_BACKEND_URL
    return await fetch(`${url}/api/work-experience/delete/${applicantEmail}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}
export default deleteWorkExperience