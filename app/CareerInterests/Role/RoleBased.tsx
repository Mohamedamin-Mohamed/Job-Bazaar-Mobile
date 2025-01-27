import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useState} from "react";
import RoleSuggestions from "@/app/Modals/RoleSuggestions";

const RoleBased = () => {
    const [viewSuggestions, setViewSuggestions] = useState(false)
    const image = require('../../Images/empty_self_chat.png')

    const handleModalDisplay = ()=> {
        setViewSuggestions(prevState => !prevState)
    }
    return (
        <View style={styles.childContainer}>
            <Text style={styles.headerText}>Role based suggestions</Text>
            <Text style={styles.subheaderText}>Get suggestions to land your desired role.</Text>
            <View style={styles.middleView}>
                <Image source={image} style={styles.image}/>
                <Text style={styles.recommendationText}>No recommendations available</Text>
            </View>
            <View style={styles.lastView}>
                <TouchableOpacity style={styles.suggestionsView}
                                  onPress={() => setViewSuggestions(prevState => !prevState)}>
                    <Text style={styles.suggestionsText}>View all suggestions</Text>
                </TouchableOpacity>
            </View>
            {viewSuggestions && <RoleSuggestions handleModalDisplay={handleModalDisplay}/>}
        </View>
    )
}
const styles = StyleSheet.create({
    childContainer: {
        width: "90%",
        padding: 16,
        borderWidth: 0.4,
        borderRadius: 8,
        borderColor: "gray",
        backgroundColor: "white"
    },
    headerText: {
        fontSize: 20,
        fontWeight: "500"
    },
    subheaderText: {
        marginTop: 10,
        fontWeight: "bold",
        color: "#4f5666",
    },
    middleView: {
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
        marginVertical: 16
    },
    image: {
        width: 140,
        height: 140
    },
    recommendationText: {
        color: "#69717f",
        fontSize: 16,
        fontWeight: "bold"
    },
    lastView: {
        justifyContent: "center",
        alignItems: "center"
    },
    suggestionsView: {
        backgroundColor: "#e6f0e1",
        width: "60%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        marginBottom: 20
    },
    suggestionsText: {
        fontSize: 16,
        color: "#367c2b",
        fontWeight: "500",
        padding: 10
    }
})
export default RoleBased