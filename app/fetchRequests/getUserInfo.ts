const getUserInfo = async (email: string, controller: AbortController)=>{
    return await fetch(`http:localhost:8080/api/person/${email}/`, {
        method: 'GET',
        signal: controller.signal
    })
}
export default getUserInfo