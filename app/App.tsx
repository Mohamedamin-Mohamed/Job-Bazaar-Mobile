import {createNativeStackNavigator} from "@react-navigation/native-stack";

import HomePanel from "@/app/Panels/HomePanel";
import CreateAccountPanel from "@/app/Panels/CreateAccountPanel";
import LoginPanel from "@/app/Panels/LoginPanel";
import Signup from "@/app/Auth/Signup";
import Login from "@/app/Auth/Login";
import ForgotPassword from "@/app/Panels/ForgotPassword";
import ResetPassword from "@/app/Panels/ResetPassword";

const Stack = createNativeStackNavigator()
const App = () => {
    return (
        <Stack.Navigator initialRouteName={"HomePanel"} >
            <Stack.Screen options={{headerTitle: ''}} initialParams={{usrEmail: ''}} name="HomePanel" component={HomePanel}/>
            <Stack.Screen options={{headerTitle: ''}} name="Signup" component={Signup}/>
            <Stack.Screen options={{headerTitle: ''}} name="Login" component={Login}/>
            <Stack.Screen options={{title: ''}} name="CreateAccount" component={CreateAccountPanel}/>
            <Stack.Screen options={{title: ''}} name="LoginPanel" component={LoginPanel}/>
            <Stack.Screen options={{title: ''}} name="ForgotPassword" component={ForgotPassword}/>
            <Stack.Screen options={{title: ''}} name="ResetPassword" component={ResetPassword}/>
        </Stack.Navigator>
    )
}
export default App