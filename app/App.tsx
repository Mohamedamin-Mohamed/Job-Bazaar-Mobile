import {createNativeStackNavigator} from "@react-navigation/native-stack";

import HomePanel from "./Panels/HomePanel";
import CreateAccountPanel from "./Panels/CreateAccountPanel";
import LoginPanel from "./Panels/LoginPanel";
import Signup from "./Auth/Signup";
import Login from "./Auth/Login";
import ForgotPassword from "./Panels/ForgotPassword";
import ResetPassword from "./Panels/ResetPassword";
import CareerHub from "./CareerHub/CareerHub";
import {Provider} from "react-redux";
import {persistor, store} from "./Redux/store";
import {PersistGate} from "redux-persist/integration/react";
import UploadedJobs from "./UploadedJobs/UploadedJobs";
import {RootStackParamList} from "./Types/types";
import CareerInterests from "./CareerHub/CareerInterests";
import UploadJob from "./UploadJob/UploadJob";
import AvailableJobs from "./AvailableJobs/AvailableJobs";
import Apply from "./ApplyJob/Apply";
import Edit from "./EditJob/Edit";
import MyReferrals from "./Referrals/MyReferrals";
import Refer from "./Referrals/Refer";
import AppliedJobs from "./Applications/AppliedJobs";

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