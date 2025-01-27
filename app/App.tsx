import '../gesture-handler'
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {DrawerActions, useNavigation} from "@react-navigation/native"
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
import {RootStackParamList} from "@/Types/types";
import UploadJob from "./UploadJob/UploadJob";
import AvailableJobs from "./AvailableJobs/AvailableJobs";
import Apply from "./ApplyJob/Apply";
import Edit from "./EditJob/Edit";
import MyReferrals from "./Referrals/MyReferrals";
import Refer from "./Referrals/Refer";
import AppliedJobs from "./Applications/AppliedJobs";
import ViewDescription from "@/app/Applications/ViewJobDescription/ViewDescription";
import ViewApplication from "@/app/Applications/ViewJobDescription/ViewApplication";
import Feedback from "@/app/Feedbacks/Feedback";
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
import LandingPanel from "@/app/Panels/LandingPanel";
import CareerInterests from "@/app/CareerInterests/CareerInterests";
import Experience from "@/app/Experience/Experience";
import ViewSettings from "@/app/Settings/ViewSettings";
import {useEffect} from "react";
import * as Updates from "expo-updates"

const StackNav = () => {
    const Stack = createNativeStackNavigator<RootStackParamList>()
    const navigation = useNavigation()
    return (
        <Stack.Navigator screenOptions={{headerTitleAlign: 'center'}}>
            <Stack.Screen options={{headerTitle: ''}} name="Landing" component={LandingPanel}/>
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
            <Stack.Screen name="CareerInterests" component={withAuth(CareerInterests)} options={{title: ''}}/>
            <Stack.Screen name="Experience" component={withAuth(Experience)} options={{title: ''}}/>
            <Stack.Screen name="UploadJob" component={withAuth(UploadJob)} options={{title: ''}}/>
            <Stack.Screen name="AvailableJobs" component={withAuth(AvailableJobs)} options={{title: ''}}/>
            <Stack.Screen name="Apply" component={Apply}/>
            <Stack.Screen name="ApplicationConfirmation" component={withAuth(ApplicationConfirmation)}
                          options={{title: ''}}/>
            <Stack.Screen name="Edit" component={withAuth(Edit)} options={{title: ''}}/>
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
            <Stack.Screen name="Settings" component={withAuth(ViewSettings)} options={{title: ''}}/>
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
    const onFetchUpdateAsync = async ()=> {
        try{
            const update = await Updates.checkForUpdateAsync();
            if(update.isAvailable){
                await Updates.fetchUpdateAsync()
                await Updates.reloadAsync()
            }
        }
        catch (err){
            alert(`Error fetching latest Expo update: ${err}`)
        }
    }

    useEffect(() => {
        onFetchUpdateAsync().catch(err => console.error(err))
    }, []);
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor} loading={null}>
                <AuthProvider>
                    <DrawerNav/>
                    <Toast/>
                </AuthProvider>
            </PersistGate>
        </Provider>
    )
}
export default App