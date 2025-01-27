const validateToken = async (token: string) => {
    if (!token) {
        console.warn('validateToken called without a token');
        return { ok: false };
    }

    const url = process.env.EXPO_PUBLIC_BACKEND_URL
    return await fetch(`${url}/api/validate-token/`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
export default validateToken;
