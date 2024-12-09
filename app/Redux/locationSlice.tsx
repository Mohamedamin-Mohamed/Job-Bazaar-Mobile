import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Location} from "../Types/types";

const initialState: Location = {
    city: '',
    state: '',
    country: ''
}

const locationSlice = createSlice({
    name: 'locationInfo',
    initialState: initialState,
    reducers: {
       setLocationInfo: (state, action: PayloadAction<Location>) =>{
           return{...state, ...action.payload}
       },
        clearLocationInfo: ()=> initialState
    }
})

export default locationSlice
export const { setLocationInfo, clearLocationInfo } = locationSlice.actions