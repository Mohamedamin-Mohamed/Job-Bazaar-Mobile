interface Signup {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string
}

const signup = async (signupRequest: Signup, controller: AbortController)=>{
    const url = process.env.EXPO_PUBLIC_BACKEND_URL
    return await fetch(`${url}/accounts/signup/`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(signupRequest),
        signal: controller.signal
    })
}
export default signup