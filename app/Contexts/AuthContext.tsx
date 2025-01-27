import {createContext, ReactNode, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import validateToken from "@/app/FetchRequests/validateToken";
import {NavigationProp} from "@react-navigation/core";
import {RootStackParamList} from "@/Types/types";
import Toast from "react-native-toast-message";

type AuthContextType = {
    checkTokenValidity: (navigation: NavigationProp<RootStackParamList>) => Promise<boolean>
    isValidating: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [isValidating, setIsValidating] = useState(false)

    let currentValidation = false;
    const checkTokenValidity = async (navigation: NavigationProp<RootStackParamList>) => {
        if (currentValidation) return false
        currentValidation = false
        setIsValidating(true);
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                await handleInvalidToken(navigation);
                return false;
            }

            const response = await validateToken(token);
            if (!response.ok) {
                await handleInvalidToken(navigation);
                return false;
            }

            return true;
        } catch (err) {
            console.error('Token validation error:', err);
            await handleInvalidToken(navigation);
            return false;
        } finally {
            currentValidation = false
            setIsValidating(false);
        }
    };


    const handleInvalidToken = async (navigation: NavigationProp<RootStackParamList>) => {
        await AsyncStorage.removeItem("token")
        Toast.show({
            type: "error",
            text1: "Token expired, please login again",
            onHide: async () => navigation.reset({
                index: 0,
                routes: [{name: "HomePanel"}]
            })
        })
    }

    return <AuthContext.Provider value={{checkTokenValidity, isValidating}}>
        {children}
        <Toast/>
    </AuthContext.Provider>
}
export default AuthContext
