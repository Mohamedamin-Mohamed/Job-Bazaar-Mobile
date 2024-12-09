import {Text, TouchableOpacity, View, StyleSheet, ActivityIndicator} from "react-native";

const Buttons = ({handleButtons, disabled, loading}: {
    handleButtons: (type: string) => void,
    disabled: boolean,
    loading: boolean
}) => {
    return (
        <View style={styles.row}>
            <TouchableOpacity onPress={() => handleButtons('clear')} disabled={disabled}>
                <Text style={styles.clearButton}>Clear</Text>
            </TouchableOpacity>
            <View style={{flexDirection: "row", gap: 16}}>
                <TouchableOpacity onPress={() => handleButtons('cancel')} disabled={disabled}>
                    <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleButtons('save')} disabled={disabled}>
                    {loading ? <ActivityIndicator size="large" color="black"/> :
                        <Text style={styles.saveButton}>Save</Text>}
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    clearButton: {
        width: 72,
        height: 30,
        color: "#367c2b",
        fontWeight: "bold",
        borderWidth: 1,
        borderRadius: 2,
        textAlign: "center",
        borderColor: "#367c2b",
        padding: 6,
        fontSize: 16
    },
    cancelButton: {
        width: 72,
        height: 30,
        color: "#367c2b",
        fontWeight: "bold",
        borderWidth: 1,
        borderRadius: 2,
        textAlign: "center",
        borderColor: "#367c2b",
        padding: 6,
        fontSize: 16
    },
    saveButton: {
        width: 72,
        height: 30,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: "white",
        textAlign: "center",
        backgroundColor: "#ffde00",
        padding: 6,
        fontWeight: "bold",
        fontSize: 16
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 20,
    },
})
export default Buttons