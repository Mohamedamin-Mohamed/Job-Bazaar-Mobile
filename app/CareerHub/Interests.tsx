import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {RootStackParamList} from "../Types/types";
import {NavigationProp} from "@react-navigation/core";

type CareerHubProp = NavigationProp<RootStackParamList, 'CareerHub'>

const Interests = ({navigation}: { navigation: CareerHubProp }) => {
    const handleNavigation = () => {
        navigation.navigate('CareerInterests')
    }
    return (
        <View style={styles.container}>
            <View style={styles.childContainer}>
                <View>
                    <Text style={styles.headerText}>Set your career interests</Text>
                    <View>
                        <Text style={{fontSize: 15, marginTop: 16, textAlign: "center"}}>Share your career goals, and
                            we'll create a plan for you.</Text>
                        <View style={{justifyContent: "center", alignItems: "center"}}>
                            <TouchableOpacity onPress={() => handleNavigation} style={styles.interestsButton}>
                                <Text style={{fontSize: 18}}>Set Your Career Interests</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "stretch",
        color: "black"
    },
    childContainer: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 24,
        borderColor: "white",
        backgroundColor: "white",
    },
    headerText: {
        fontSize: 22,
    },
    interestsButton: {
        width: 250,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        backgroundColor: "#ffde00",
        marginTop: 36,
    }
})
export default Interests