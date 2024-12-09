import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {SetUserInfoPayload, User} from "../Types/types";

const initialState: User = {
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    createdAt: ''
}

const userSlice = createSlice({
    name: 'userInfo',
    initialState: initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<SetUserInfoPayload>) => {
            return { ...state, ...action.payload };
        },
        clearUserInfo: () => initialState
    }
})

export default userSlice.reducer
export const {setUserInfo, clearUserInfo} = userSlice.actions