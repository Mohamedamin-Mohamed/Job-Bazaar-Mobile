const emailValidation = (email: string)=>{
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(email)
}
export default emailValidation