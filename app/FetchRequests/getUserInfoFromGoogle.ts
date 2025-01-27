const getUserInfoFromGoogle = async (token: string | undefined) => {
    return await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}
export default getUserInfoFromGoogle