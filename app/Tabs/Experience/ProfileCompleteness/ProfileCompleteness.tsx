import {ScrollView, StyleSheet, Text, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {useState} from "react";
import Resume from "@/app/Tabs/Experience/ProfileCompleteness/Resume";
import Skills from "@/app/Tabs/Experience/ProfileCompleteness/Skills";
import Studies from "@/app/Tabs/Experience/ProfileCompleteness/Studies";
import Goals from "@/app/Tabs/Experience/ProfileCompleteness/Goals";

const ProfileCompleteness = () => {
    const [expandLess, setExpandLess] = useState(false)
    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.childContainer}>
                    <View style={styles.headerView}>
                        <Text style={styles.headerText}>Make Career Hub work for you</Text>
                        <Icon name={!expandLess ? "expand-less" : "expand-more"} size={30}
                              onPress={() => setExpandLess(prevState => !prevState)} style={styles.iconStyle}/>
                    </View>
                    <View style={{alignItems: "center", gap: 20}}>
                        {!expandLess && (
                            <View style={styles.contentContainer}>
                                <Text style={styles.infoText}>
                                    Add more to your profile and get recommendations for the career you want.
                                </Text>

                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.horizontalScrollContainer}>
                                    <View style={styles.componentWrapper}>
                                        <Resume/>
                                    </View>
                                    <View style={styles.componentWrapper}>
                                        <Skills/>
                                    </View>
                                    <View style={styles.componentWrapper}>
                                        <Studies/>
                                    </View>
                                    <View style={styles.componentWrapper}>
                                        <Goals/>
                                    </View>
                                </ScrollView>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
    },
    childContainer: {
        backgroundColor: "white",
        padding: 24,
        borderWidth: 0.4,
        borderRadius: 4,
        borderColor: "gray",
        marginVertical: 20,
        width: "96%",
        alignSelf: "center",
    },
    headerView: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },
    headerText: {
        fontSize: 20,
        fontWeight: "500",
    },
    iconStyle: {
        marginLeft: "auto",
    },
    contentContainer: {
        marginTop: 20,
        borderTopWidth: 0.4,
        paddingTop: 20

    },
    infoText: {
        fontSize: 17,
        marginBottom: 20,
        borderBottomWidth: 0.4,
        paddingBottom: 20
    },
    horizontalScrollContainer: {
        flexDirection: "row",
        paddingHorizontal: 10, // Padding around the scroll view
        gap: 20, // Space between components
    },
    componentWrapper: {
        width: 200, // Fixed width for each component
        alignItems: "center", // Center content inside the wrapper
    },
});
export default ProfileCompleteness