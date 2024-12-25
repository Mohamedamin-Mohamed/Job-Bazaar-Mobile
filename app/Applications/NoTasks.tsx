import {Image, StyleSheet, Text, View} from "react-native";
import {useSelector} from "react-redux";
import {RootState} from "../Types/types";

const NoTasks = () => {
    const userInfo = useSelector((state: RootState) => state.userInfo)
    const names = {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName
    }
    return (
        <>
            <View style={styles.namesView}>
                <Text style={styles.text}>Welcome {names.firstName} {names.lastName}</Text>
            </View>
            <View style={styles.container}>
                <View style={styles.childContainer}>
                    <Text style={styles.text}>My Tasks</Text>
                    <View style={styles.imageView}>
                        <Image source={require('../Images/no_tasks.png')} style={styles.image}/>
                        <Text style={{fontSize: 16}}>You have no tasks</Text>
                    </View>
                </View>
            </View>
        </>
    )
}
const styles = StyleSheet.create({
    namesView: {
        marginTop: 24,
        marginLeft: 24
    },
    container: {
        marginVertical: 24,
        justifyContent: "center",
        alignItems: "center"
    },
    childContainer: {
        width: "90%",
        padding: 24,
        backgroundColor: "white",
        borderColor: "white",
        borderRadius: 4,
    },
    text: {
        fontSize: 20,
        fontWeight: "bold"
    },
    imageView: {
        justifyContent: "center",
        alignItems: "center"
    },
    image: {
        width: 360,
        height: 180
    },
})
export default NoTasks