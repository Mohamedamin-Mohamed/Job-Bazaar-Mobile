import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../../Types/types";
import {NavigationProp} from "@react-navigation/core";

type NoApplicationProp = NavigationProp<RootStackParamList, 'AppliedJobs'>
const NoApplications = ({navigation}: { navigation: NoApplicationProp }) => {
    const handleNavigation = () => {
        navigation.navigate('AvailableJobs')
    }

    return (
        <View style={styles.container}>
            <Image source={require('../../Images/no_application_banner.png')}/>
            <Text style={{fontSize: 16}}>You have no applications</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleNavigation()}>
                <Text style={styles.buttonText}>Search For Jobs</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 4
    },
    button: {
        borderColor: "#367c2b",
        marginTop: 10
    },
    buttonText: {
        color: "#367c2b",
        fontWeight: "bold",
        fontSize: 18,
        borderRadius: 4,
        borderWidth: 1,
        padding: 10,
        marginTop: 4,
        borderColor: "#367c2b"
    }
})


export default NoApplications