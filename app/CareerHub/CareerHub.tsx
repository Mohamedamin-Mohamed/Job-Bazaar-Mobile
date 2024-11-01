import {View, Text, StyleSheet, Animated} from "react-native";
import Interests from "@/app/CareerHub/Interests";
import {useSelector} from "react-redux";
import {RootStackParamList, RootState} from "@/app/Types/types";
import Explore from "@/app/CareerHub/Explore";
import ScrollView = Animated.ScrollView;
import {StackNavigationProp} from "@react-navigation/stack";

interface User {
    email: string,
    firstName: string,
    lastName: string,
    role: string,
    createdAt: string
}

type CareerHubProp = StackNavigationProp<RootStackParamList, 'CareerHub'>

const CareerHub = ({navigation}: {navigation: CareerHubProp}) => {
    const user = useSelector((state: RootState) => state.userInfo)
    console.log('Role of the user is', user.role)

    const abbreviatedName = user.firstName.substring(0, 1) + user.lastName.substring(0, 1)
    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.childContainer}>
                    <View style={styles.nameParent}>
                        <View style={styles.abbrevNameParent}>
                            <Text style={styles.abbrevName}>{abbreviatedName}</Text>
                        </View>
                        <View style={{justifyContent: "center", marginLeft: 20}}>
                            <Text style={{fontSize: 22, fontWeight: "bold"}}>Hi {user.firstName}</Text>
                            <Text style={{color: "#757575", fontSize: 14, fontWeight: "bold"}}>Welcome to your Career
                                Hub</Text>
                        </View>
                    </View>
                    <View style={{gap: 24, width: "100%"}}>
                        <Interests navigation={navigation}/>
                        <Explore navigation={navigation}/>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        flexDirection: "column",
        color: "black"
    },
    childContainer: {
        flex: 0.68,
        borderWidth: 1,
        borderRadius: 12,
        padding: 24,
        borderColor: "white",
    },
    nameParent: {
        flexDirection: "row",
        marginBottom: 30
    },
    abbrevNameParent: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#367c2b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    abbrevName: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
})
export default CareerHub