const addressFetcher = async (location: { latitude: number, longitude: number }, controller: AbortController) => {
    return await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`, {
            signal: controller.signal
        })
}
export default addressFetcher
