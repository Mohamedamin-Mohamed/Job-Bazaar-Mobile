import './app/gesture-handler'
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {DrawerActions, useNavigation} from "@react-navigation/native"
import HomePanel from "./app/Panels/HomePanel";
import CreateAccountPanel from "./app/Panels/CreateAccountPanel";
import LoginPanel from "./app/Panels/LoginPanel";
import Signup from "./app/Auth/Signup";
import Login from "./app/Auth/Login";
import ForgotPassword from "./app/Panels/ForgotPassword";
import ResetPassword from "./app/Panels/ResetPassword";
import CareerHub from "./app/CareerHub/CareerHub";
import {Provider} from "react-redux";
import {persistor, store} from "./app/Redux/store";
import {PersistGate} from "redux-persist/integration/react";
import UploadedJobs from "./app/UploadedJobs/UploadedJobs";
import {RootStackParamList} from "./app/Types/types";
import UploadJob from "./app/UploadJob/UploadJob";
import AvailableJobs from "./app/AvailableJobs/AvailableJobs";
import Apply from "./app/ApplyJob/Apply";
import Edit from "./app/EditJob/Edit";
import MyReferrals from "./app/Referrals/MyReferrals";
import Refer from "./app/Referrals/Refer";
import AppliedJobs from "./app/Applications/AppliedJobs";
import ViewDescription from "@/app/Applications/ViewJobDescription/ViewDescription";
import ViewApplication from "@/app/Applications/ViewJobDescription/ViewApplication";
import Feedback from "@/app/CareerHub/Feedbacks/Feedback";
import ProfileTabNavigator from "@/app/Tabs/ProfileTabNavigator";
import ApplicationConfirmation from "@/app/ApplyJob/ApplicationConfirmation";
import {createDrawerNavigator} from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/MaterialIcons";
import DrawerContent from "@/app/Drawers/DrawerContent";
import ManagementHub from "@/app/Management/ManagementHub";
import ViewJobDescription from "@/app/Management/ViewJob/ViewJobDescription";
import ViewJob from "@/app/Management/ViewJob/ViewJob";
import ViewApplicant from "@/app/Management/ViewApplicants/ViewApplicant";
import {AuthProvider} from "@/app/Contexts/AuthContext";
import withAuth from "@/app/Contexts/withAuth";
import Toast from "react-native-toast-message";
import React from 'react';


const StackNav = () => {
    const Stack = createNativeStackNavigator<RootStackParamList>()
    const navigation = useNavigation()

    return (
        <Stack.Navigator initialRouteName={"HomePanel"} screenOptions={{
            headerTitleAlign: 'center'
        }}>
            <Stack.Screen options={{headerTitle: ''}} name="HomePanel" component={HomePanel}/>
            <Stack.Screen options={{headerTitle: ''}} name="Signup" component={Signup}/>
            <Stack.Screen options={{headerTitle: ''}} name="Login" component={Login}/>
            <Stack.Screen options={{title: ''}} name="CreateAccount" component={CreateAccountPanel}/>
            <Stack.Screen options={{title: ''}} name="LoginPanel" component={LoginPanel}/>
            <Stack.Screen options={{title: ''}} name="ForgotPassword" component={ForgotPassword}/>
            <Stack.Screen options={{title: ''}} name="ResetPassword" component={ResetPassword}/>

            <Stack.Screen options={{
                headerLeft: () => {
                    return (
                        <Icon
                            name="menu"
                            size={30}
                            color="#367c2b"
                            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                        />
                    )
                }
            }} name="CareerHub" component={withAuth(CareerHub)}/>
            <Stack.Screen name="UploadedJobs" component={withAuth(UploadedJobs)} options={{title: ''}}/>
            <Stack.Screen name="Profile" component={withAuth(ProfileTabNavigator)} options={{title: ''}}/>
            <Stack.Screen name="UploadJob" component={withAuth(UploadJob)} options={{title: ''}}/>
            <Stack.Screen name="AvailableJobs" component={withAuth(AvailableJobs)} options={{title: ''}}/>
            <Stack.Screen name="Apply" component={Apply}/>
            <Stack.Screen name="ApplicationConfirmation" component={withAuth(ApplicationConfirmation)}
                          options={{title: ''}}/>
            <Stack.Screen name="Edit" component={withAuth(Edit)}/>
            <Stack.Screen name="MyReferrals" component={withAuth(MyReferrals)} options={{title: ''}}/>
            <Stack.Screen name="Refer" component={withAuth(Refer)} options={{title: ''}}/>
            <Stack.Screen name="AppliedJobs" component={withAuth(AppliedJobs)} options={{title: ''}}/>
            <Stack.Screen name="ViewApplicationDescription" component={withAuth(ViewDescription)}
                          options={{title: ''}}/>
            <Stack.Screen name="ViewApplication" component={withAuth(ViewApplication)}
                          options={{title: 'Application View'}}/>
            <Stack.Screen name="Feedbacks" component={withAuth(Feedback)} options={{title: ''}}/>
            <Stack.Screen name="ManagementHub" component={withAuth(ManagementHub)} options={{title: ''}}/>
            <Stack.Screen name="ViewJobDescription" component={withAuth(ViewJobDescription)} options={{title: ''}}/>
            <Stack.Screen name="ViewJob" component={withAuth(ViewJob)} options={{title: ''}}/>
            <Stack.Screen name="ViewApplicants" component={withAuth(ViewApplicant)} options={{title: ''}}/>
        </Stack.Navigator>
    )
}

const DrawerNav = () => {
    const Drawer = createDrawerNavigator<RootStackParamList>()
    return (
        <Drawer.Navigator screenOptions={{
            headerShown: false,
            drawerStyle: {
                backgroundColor: "#F5F5F5"
            }
        }} drawerContent={props => <DrawerContent {...props} />}>
            <Drawer.Screen name="RootStack" component={StackNav}/>
        </Drawer.Navigator>
    )

}
const App = () => {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor} loading={null}>
                <AuthProvider>
                    <DrawerNav/>
                    <Toast/>
                </AuthProvider>
            </PersistGate>
        </Provider>
    );

}
export default App