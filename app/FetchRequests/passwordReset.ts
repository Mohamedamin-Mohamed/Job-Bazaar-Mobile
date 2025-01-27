type PasswordReset = {
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    role: string,
    createdAt: string
}
const passwordReset = async (requestBody: PasswordReset)=>{
    const url = process.env.EXPO_PUBLIC_BACKEND_URL
    return await fetch(`${url}/accounts/login/password-reset/`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
}
export default passwordReset