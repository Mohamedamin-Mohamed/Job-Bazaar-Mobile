const emailLookup = async (email: string)=>{
    return await fetch(`http:localhost:8080/accounts/login/${email}/email-lookup/`, {
        method: 'GET',
    })
}
export default emailLookup