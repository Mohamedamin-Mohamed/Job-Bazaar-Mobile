import AsyncStorage from "@react-native-async-storage/async-storage";

interface JobDetails {
    employerEmail: string,
    jobId?: string,
    position: string,
    company: string,
    workPlace: string,
    location: string,
    jobFunction: string,
    jobType: string,
    description: string,
    requirements: string,
    postedDate: string,
    jobStatus: string,
}

const uploadJob = async (jobRequest: JobDetails, controller: AbortController) => {
    const token = await AsyncStorage.getItem('token')
    if (!token) {
        throw new Error('Token not found');
    }

    const url = process.env.EXPO_PUBLIC_BACKEND_URL
    return await fetch(`${url}/api/jobs/upload`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(jobRequest),
        signal: controller.signal
    })
}
export default uploadJob