interface LoginRequest {
    email: string,
    password: string
}
const login = async (loginRequest: LoginRequest)=> {
    return await  fetch('http:localhost:8080/accounts/login/', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(loginRequest)
    })
}
export default login