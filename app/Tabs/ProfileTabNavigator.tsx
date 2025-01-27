import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Experience from "@/app/Experience/Experience";
import CareerInterests from "@/app/CareerInterests/CareerInterests";
import Icon from "react-native-vector-icons/MaterialIcons";
import {RootTabParamList} from "@/Types/types";

const Tab = createBottomTabNavigator<RootTabParamList>()

const ProfileTabNavigator = () => {

    return (
        <Tab.Navigator initialRouteName={'CareerInterests'} screenOptions={({route}) => ({
            headerShown: false,
            tabBarLabelStyle: {fontSize: 16},
            tabBarIcon: ({color, size}) => {
                let iconName
                if (route.name === 'Experience') {
                    iconName = 'work'
                } else {
                    iconName = 'interests'
                }
                return <Icon name={iconName} size={size} color={color}/>
            },

        })}>
            <Tab.Screen name="Experience" component={Experience}/>
            <Tab.Screen name="CareerInterests" component={CareerInterests}/>
        </Tab.Navigator>
    )
}
export default ProfileTabNavigator