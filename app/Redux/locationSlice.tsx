import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Location} from "@/Types/types";

const initialState: Location = {
    city: '',
    state: '',
    country: ''
}

const locationSlice = createSlice({
    name: 'locationInfo',
    initialState: initialState,
    reducers: {
        setLocationInfo: (state, action: PayloadAction<Location>) => {
            state.city = action.payload.city;
            state.state = action.payload.state;
            state.country = action.payload.country;
        },
        clearLocationInfo: () => initialState
    }
})

export default locationSlice.reducer
export const {setLocationInfo, clearLocationInfo} = locationSlice.actions