import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {RootStackParamList} from "../Types/types";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

type MyReferralsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MyReferrals'>

const NoAvailableReferrals = ({navigation}: { navigation: MyReferralsNavigationProp }) => {
    /*
    return (
       <div className="flex flex-col justify-center items-center">
            <div className="w-[206px] h-[142px] flex justify-center mt-8">
                <img src={Image} alt="" className="w-[130px] h-[220px]"/>
            </div>
            <div className="flex flex-col justify-center mt-24 p-2">
                <p className="text-[#4f5666]">You haven't referred anyone yet</p>
                <button
                    className="text-[#367c2b] font-medium w-[57.5%] border border-[#367c2b] flex ml-16 mt-4 pl-3 py-1 hover:bg-[#367c2b] hover:text-white"
                    onClick={handleRefer}>Refer A Friend
                </button>
            </div>
        </div>
    )
     */
    const handleRefer = () => {
        navigation.replace('Refer')
    }
    return (
        <View style={styles.container}>
            <View style={styles.imageView}>
                <Image source={require('../Images/404_illustration.png')} style={styles.image}/>
            </View>
            <View style={styles.childContainer}>
                <Text style={styles.text}>You haven't referred anyone yet</Text>
                <TouchableOpacity style={styles.parentText} onPress={() => handleRefer()}>
                    <Text style={styles.buttonText}>Refer A Friend</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 0.5,
        flexDirection: "column"
    },
    childContainer: {
        justifyContent: "center",
        alignItems: "center"
    },
    imageView: {
        justifyContent: "center",
        alignItems: "center"
    },
    image: {
        width: 130,
        height: 220,
    },
    text: {
        color: "#4f5666",
        fontSize: 22,
        alignItems: 'center',
        marginVertical: 24
    },
    parentText: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderWidth: 1.4,
        borderColor: "#367c2b",
        width: 136,
        height: 36
    },
    buttonText: {
        color: "#367c2b",
        fontWeight: "bold",
        fontSize: 16
    }
})
export default NoAvailableReferrals