import {StyleSheet, Text, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/app/Types/types";
import Icon from "react-native-vector-icons/MaterialIcons";
import {DrawerContentComponentProps, DrawerContentScrollView, DrawerItem} from "@react-navigation/drawer";
import {DrawerNavigationHelpers} from "@react-navigation/drawer/src/types";
import {clearUserInfo} from "@/app/Redux/userSlice";
import {CommonActions} from "@react-navigation/native";
import {clearLocationInfo} from "@/app/Redux/locationSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";

type DrawerItemType = {
    icon: string;
    label: string;
    navigateTo: string;
    roles: string[];
};

const DrawerList: DrawerItemType[] = [
    {icon: 'workspaces', label: 'Career Hub', navigateTo: 'CareerHub', roles: ['Applicant', 'Employer']},
    {icon: 'star-outline', label: 'Profile', navigateTo: 'Profile', roles: ['Applicant']},
    {icon: 'work-outline', label: 'Uploaded Jobs', navigateTo: 'UploadedJobs', roles: ['Employer']},
    {icon: 'drive-folder-upload', label: 'Upload Job', navigateTo: 'UploadJob', roles: ['Employer']},
    {icon: 'search', label: 'Job Search', navigateTo: 'AvailableJobs', roles: ['Applicant']},
    {icon: 'assignment-turned-in', label: 'Applied Jobs', navigateTo: 'AppliedJobs', roles: ['Applicant']},
    {icon: 'feedback', label: 'Feedbacks', navigateTo: 'Feedbacks', roles: ['Applicant']},
    {icon: 'hub', label: 'Management Hub', navigateTo: 'ManagementHub', roles: ['Employer']},
    {icon: 'group-add', label: 'My Referrals', navigateTo: 'MyReferrals', roles: ['Applicant']},
];

type DrawerLayoutProps = {
    navigation: DrawerContentComponentProps['navigation'];
    icon: string,
    label: string,
    navigateTo: string
}
const DrawerLayout = ({navigation, icon, label, navigateTo}: DrawerLayoutProps) => {
    return (
        <DrawerItem icon={() => <Icon name={icon} color="#367c2b" size={30}/>}
                    label={label} labelStyle={styles.drawerItemLabel}
                    onPress={() => navigation.navigate("RootStack", {screen: navigateTo})}/>
    )
}

const DrawerItems = ({navigation}: { navigation: DrawerNavigationHelpers }) => {
    const userRole = useSelector((state: RootState) => state.userInfo).role
    const filteredDrawerList = DrawerList.filter(item => item.roles.includes(userRole))
    return (
        <>
            {filteredDrawerList.map((element, index) => (
                <DrawerLayout
                    key={index}
                    navigation={navigation}
                    icon={element.icon}
                    label={element.label}
                    navigateTo={element.navigateTo}
                />
            ))}
        </>
    );
}

const DrawerContent = (props: DrawerContentComponentProps) => {
    const {navigation} = props
    const userInfo = useSelector((state: RootState) => state.userInfo)
    const dispatch = useDispatch()

    const handleSignOut = async () => {
        dispatch(clearUserInfo())
        dispatch(clearLocationInfo())

        await AsyncStorage.setItem('token', '').catch(err => console.error(err))

        navigation.dispatch(CommonActions.reset({
            index: 0,
            routes: [
                {
                    name: 'RootStack',
                    state: {
                        routes: [{name: 'HomePanel'}]
                    }
                }
            ]
        }))
    }

    return (
        <View style={{flex: 1}}>
            <DrawerContentScrollView {...props}>
                <View style={{flexDirection: "row", gap: 14}}>
                    <Icon name="person" size={48} color="gray"/>
                    <View style={{marginVertical: 4}}>
                        <Text style={styles.headerText}>{userInfo.firstName} {userInfo.lastName}</Text>
                        <Text style={[styles.headerText, {fontSize: 16}]}>{userInfo.email}</Text>
                    </View>
                </View>
                <View style={styles.drawerItemsView}>
                    <DrawerItems navigation={navigation}/>
                </View>
            </DrawerContentScrollView>
            <View style={[styles.drawerItemsView, {borderBottomWidth: 0.4, borderTopWidth: 0}]}>
                <DrawerItem
                    label="Sign Out"
                    labelStyle={styles.drawerItemLabel}
                    icon={() => <Icon name="exit-to-app" color="#367c2b" size={30}/>}
                    onPress={() => handleSignOut()} style={styles.signOutButton}/>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    headerText: {
        color: "#1f2329",
        fontSize: 22,
    },
    drawerItemsView: {
        borderTopWidth: 0.4,
        width: "95%",
        marginLeft: 10,
        marginVertical: 24,
        paddingTop: 20
    },
    signOutButton: {
        marginLeft: 10,
        marginVertical: 24,
    },
    drawerItemLabel: {
        fontSize: 20
    }
})
export default DrawerContent