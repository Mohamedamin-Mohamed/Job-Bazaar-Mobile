import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Signup from "@/app/Navbars/Signup";
import Login from "@/app/Navbars/Login";
import HomePanel from "@/app/Panels/HomePanel";
import CreateAccountPanel from "@/app/Panels/CreateAccountPanel";
import LoginPanel from "@/app/Panels/LoginPanel";

const Stack = createNativeStackNavigator()
const App = () => {
    return (
        <Stack.Navigator initialRouteName={"HomePanel"} >
            <Stack.Screen options={{headerTitle: ''}} initialParams={{usrEmail: ''}} name="HomePanel" component={HomePanel}/>
            <Stack.Screen options={{headerTitle: ''}} name="Signup" component={Signup}/>
            <Stack.Screen options={{headerTitle: ''}} name="Login" component={Login}/>
            <Stack.Screen name={"CreateAccount"} component={CreateAccountPanel}/>
            <Stack.Screen options={{title: ''}} name={"LoginPanel"} component={LoginPanel}/>
        </Stack.Navigator>
    )
}
export default App