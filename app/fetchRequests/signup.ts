interface Signup {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string
}
const signup = async (signupRequest: Signup)=>{
    return await fetch('http://192.168.1.252:8080/accounts/signup/', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(signupRequest)
    })
}
export default signup