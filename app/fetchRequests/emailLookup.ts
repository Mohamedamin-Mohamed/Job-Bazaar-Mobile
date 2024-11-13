const emailLookup = async (email: string)=>{
    return await fetch(`http://192.168.1.252:8080/accounts/login/${email}/email-lookup/`, {
        method: 'GET',
    })
}
export default emailLookup