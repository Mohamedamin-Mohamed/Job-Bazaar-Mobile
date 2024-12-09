import {combineReducers} from "redux";
import userSlice from "./userSlice";
import locationSlice from "./locationSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {persistReducer, persistStore} from "redux-persist"
import {configureStore} from "@reduxjs/toolkit";
const rootReducer = combineReducers({
    userInfo: userSlice,
    locationInfo: locationSlice
})

const persistConfig = {
    key: 'root',
    storage: AsyncStorage
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
})
export const persistor = persistStore(store)
export default {store, persistor}