type PasswordReset = {
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    role: string,
    createdAt: string
}
const passwordReset = async (requestBody: PasswordReset)=>{
    return await fetch('http://192.168.1.252:8080/accounts/login/password-reset/', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
}
export default passwordReset