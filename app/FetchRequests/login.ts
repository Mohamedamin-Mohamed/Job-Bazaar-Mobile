interface LoginRequest {
    email: string,
    password: string
}
const login = async (loginRequest: LoginRequest)=> {
    const url = process.env.EXPO_PUBLIC_BACKEND_URL
    return await  fetch(`${url}/accounts/login/`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(loginRequest)
    })
}
export default login