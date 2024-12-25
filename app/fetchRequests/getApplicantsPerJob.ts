import AsyncStorage from "@react-native-async-storage/async-storage";

const getApplicantsPerJob = async (jobIds:string[], controller: AbortController) => {
    const token = await AsyncStorage.getItem('token')
    if(!token){
        throw new Error('No token available')
    }
    return await fetch('http://192.168.1.252:8080/api/jobs/applicants-count', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobIds),
        signal: controller.signal
    })
}
export default getApplicantsPerJob