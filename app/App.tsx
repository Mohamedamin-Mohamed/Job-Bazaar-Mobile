import './gesture-handler'
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {DrawerActions, useNavigation} from "@react-navigation/native"
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
import UploadJob from "./UploadJob/UploadJob";
import AvailableJobs from "./AvailableJobs/AvailableJobs";
import Apply from "./ApplyJob/Apply";
import Edit from "./EditJob/Edit";
import MyReferrals from "./Referrals/MyReferrals";
import Refer from "./Referrals/Refer";
import AppliedJobs from "./Applications/AppliedJobs";
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
import NoApplicants from "@/app/Management/ViewApplicants/NoApplicants";

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
            <Stack.Screen name="UploadedJobs" component={UploadedJobs} options={{title: ''}}/>
            <Stack.Screen name="Profile" component={ProfileTabNavigator} options={{title: ''}}/>
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
            }} name="CareerHub" component={CareerHub}/>
            <Stack.Screen name="UploadJob" component={UploadJob} options={{title: ''}}/>
            <Stack.Screen name="AvailableJobs" component={AvailableJobs} options={{title: ''}}/>
            <Stack.Screen name="Apply" component={Apply}/>
            <Stack.Screen name="ApplicationConfirmation" component={ApplicationConfirmation}
                          options={{title: ''}}/>
            <Stack.Screen name="Edit" component={Edit}/>
            <Stack.Screen name="MyReferrals" component={MyReferrals} options={{title: ''}}/>
            <Stack.Screen name="Refer" component={Refer} options={{title: ''}}/>
            <Stack.Screen name="AppliedJobs" component={AppliedJobs} options={{title: ''}}/>
            <Stack.Screen name="ViewApplicationDescription" component={ViewDescription}
                          options={{title: ''}}/>
            <Stack.Screen name="ViewApplication" component={ViewApplication}
                          options={{title: 'Application View'}}/>
            <Stack.Screen name="Feedbacks" component={Feedback} options={{title: ''}}/>
            <Stack.Screen name="ManagementHub" component={ManagementHub} options={{title: ''}}/>
            <Stack.Screen name="ViewJobDescription" component={ViewJobDescription} options={{title: ''}}/>
            <Stack.Screen name="ViewJob" component={ViewJob} options={{title: ''}}/>
            <Stack.Screen name="ViewApplicants" component={ViewApplicant} options={{title: ''}}/>
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
            },
        }} drawerContent={props => <DrawerContent {...props} />}>
            <Drawer.Screen name="RootStack" component={StackNav}/>
        </Drawer.Navigator>
    )

}
const App = () => {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor} loading={null}>
                <DrawerNav/>
            </PersistGate>
        </Provider>
    )
}
export default App