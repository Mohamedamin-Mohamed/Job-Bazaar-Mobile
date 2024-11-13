import {createNativeStackNavigator} from "@react-navigation/native-stack";

import HomePanel from "@/app/Panels/HomePanel";
import CreateAccountPanel from "@/app/Panels/CreateAccountPanel";
import LoginPanel from "@/app/Panels/LoginPanel";
import Signup from "@/app/Auth/Signup";
import Login from "@/app/Auth/Login";
import ForgotPassword from "@/app/Panels/ForgotPassword";
import ResetPassword from "@/app/Panels/ResetPassword";
import CareerHub from "@/app/CareerHub/CareerHub";
import {Provider} from "react-redux";
import {persistor, store} from "@/app/Redux/store";
import {PersistGate} from "redux-persist/integration/react";
import UploadedJobs from "@/app/UploadedJobs/UploadedJobs";
import {RootStackParamList} from "@/app/Types/types";
import CareerInterests from "@/app/CareerHub/CareerInterests";
import UploadJob from "@/app/UploadJob/UploadJob";
import AvailableJobs from "@/app/AvailableJobs/AvailableJobs";
import Apply from "@/app/ApplyJob/Apply";
import Edit from "@/app/EditJob/Edit";
import MyReferrals from "@/app/Referrals/MyReferrals";
import Refer from "@/app/Referrals/Refer";
import AppliedJobs from "@/app/Applications/AppliedJobs";

const Stack = createNativeStackNavigator<RootStackParamList>()
const App = () => {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor} loading={null}>
                <Stack.Navigator initialRouteName={"HomePanel"}>
                    <Stack.Screen options={{headerTitle: ''}} name="HomePanel"
                                  component={HomePanel}/>
                    <Stack.Screen options={{headerTitle: ''}} name="Signup" component={Signup}/>
                    <Stack.Screen options={{headerTitle: ''}} name="Login" component={Login}/>
                    <Stack.Screen options={{title: ''}} name="CreateAccount" component={CreateAccountPanel}/>
                    <Stack.Screen options={{title: ''}} name="LoginPanel" component={LoginPanel}/>
                    <Stack.Screen options={{title: ''}} name="ForgotPassword" component={ForgotPassword}/>
                    <Stack.Screen options={{title: ''}} name="ResetPassword" component={ResetPassword}/>
                    <Stack.Screen name="CareerHub" component={CareerHub}/>
                    <Stack.Screen name="UploadedJobs" component={UploadedJobs}/>
                    <Stack.Screen name="CareerInterests" component={CareerInterests}/>
                    <Stack.Screen name="UploadJob" component={UploadJob}/>
                    <Stack.Screen name="AvailableJobs" component={AvailableJobs}/>
                    <Stack.Screen name="Apply" component={Apply}/>
                    <Stack.Screen name="Edit" component={Edit}/>
                    <Stack.Screen name="MyReferrals" component={MyReferrals} options={{title: 'Referrals'}}/>
                    <Stack.Screen name="Refer" component={Refer}/>
                    <Stack.Screen name="AppliedJobs" component={AppliedJobs}/>
                </Stack.Navigator>
            </PersistGate>
        </Provider>
    )
}
export default App