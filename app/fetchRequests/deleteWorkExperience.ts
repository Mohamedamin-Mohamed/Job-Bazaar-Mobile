import AsyncStorage from "@react-native-async-storage/async-storage";

const deleteWorkExperience = async (applicantEmail: string) => {
    const token = await AsyncStorage.getItem('token')
    if (!token) {
        throw new Error('No token available')
    }
    return await fetch(`http://192.168.1.252:8080/api/work-experience/delete/${applicantEmail}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}
export default deleteWorkExperience