const getUserInfo = async (email: string, controller: AbortController)=>{
    const url = process.env.EXPO_PUBLIC_BACKEND_URL
    return await fetch(`${url}/api/person/${email}/`, {
        method: 'GET',
        signal: controller.signal
    })
}
export default getUserInfo