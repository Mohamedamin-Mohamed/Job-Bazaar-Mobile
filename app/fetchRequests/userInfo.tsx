const userInfo = async (email: string)=>{
    return await fetch(`http://localhost:8080/api/person/${email}/`, {
        method: 'GET'
    })
}
export default userInfo