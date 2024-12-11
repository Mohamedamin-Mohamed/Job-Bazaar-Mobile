import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Experience from "@/app/Tabs/Experience/Experience";
import CareerInterests from "@/app/Tabs/CareerInterests/CareerInterests";
import Icon from "react-native-vector-icons/MaterialIcons";

const Tab = createBottomTabNavigator()

const ProfileTabNavigator = ()=> {

    return(
        <Tab.Navigator screenOptions={({route}) => ({
            headerShown: false,
            tabBarLabelStyle: {fontSize: 20},
            tabBarIcon: ({color, size}) => {
                let iconName
                if(route.name === 'Experience'){
                    iconName = 'work'
                }
                else{
                    iconName = 'interests'
                }
                return <Icon name={iconName} size={size} color={color} />
        },

        })}>
            <Tab.Screen name="Experience" component={Experience} />
            <Tab.Screen name="Career Interests" component={CareerInterests} />
        </Tab.Navigator>
    )
}
export default ProfileTabNavigator