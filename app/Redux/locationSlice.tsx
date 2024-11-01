import {createSlice} from "@reduxjs/toolkit";

type Location = {
    city: string,
    state: string,
    country: string
}
const initialState: Location = {
    city: '',
    state: '',
    country: ''
}

const locationSlice = createSlice({
    name: 'locationInfo',
    initialState: initialState,
    reducers: {
        setLocationInfo: (state,action) =>{
            const {city, states, country} = action.payload
            state.city
            state.state = states
            state.country = country
        },
        clearLocationInfo: (state) =>{
            state.city = ''
            state.state = ''
            state.country = ''
        }
    }
})
export default locationSlice
export const { setLocationInfo, clearLocationInfo } = locationSlice.actions