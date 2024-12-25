const validateToken = async (token: string) => {
    if(!token){
        throw new Error('No token available')
    }
    return await fetch(`http://192.168.1.252:8080/api/validate-token/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}
export default validateToken