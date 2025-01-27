const emailLookup = async (email: string) => {
    const url = process.env.EXPO_PUBLIC_BACKEND_URL
    return await fetch(`${url}/accounts/login/${email}/email-lookup/`, {
        method: 'GET',
    })
}
export default emailLookup