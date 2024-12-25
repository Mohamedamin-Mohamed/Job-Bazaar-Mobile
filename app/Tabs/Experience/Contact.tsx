import {StyleSheet, Text, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {useSelector} from "react-redux";
import {RootState} from "@/app/Types/types";

const Contact = () => {
    const locationInfo = useSelector((state: RootState) => state.locationInfo)
    const applicantEmail = useSelector((state: RootState) => state.userInfo).email
    return (
        <View style={styles.container}>
            <View style={styles.childContainer}>
                <Text style={styles.heading}>Contact & Links</Text>
                <View style={styles.rowView}>
                    <Icon name="location-on" size={24} color="gray"/>
                    <Text style={styles.normalText}>{locationInfo?.city}, {locationInfo?.state}, {locationInfo?.country}</Text>
                </View>
                <View style={styles.rowView}>
                    <Icon name="mail" size={24} color="gray"/>
                    <Text style={[styles.normalText, {color: "#367c2b"}]}>{applicantEmail}</Text>
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        borderWidth: 0.4,
        borderRadius: 4,
        borderColor: "gray",
        marginVertical: 16,
        width: "92%",
        padding: 16,
        paddingHorizontal: 30,
    },
    childContainer: {
        marginVertical: 20,
        gap: 10
    },
    heading: {
        fontSize: 18,
        fontWeight: "500",
        marginBottom: 10,
    },
    rowView: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
    },
    normalText: {
        fontSize: 16,
        width: "95%"
    }
})
export default Contact