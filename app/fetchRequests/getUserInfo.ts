const getUserInfo = async (email: string, controller: AbortController)=>{
    return await fetch(`http://192.168.1.252:8080/api/person/${email}/`, {
        method: 'GET',
        signal: controller.signal
    })
}
export default getUserInfo