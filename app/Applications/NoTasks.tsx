import {Image, StyleSheet, Text, View} from "react-native";
import {useSelector} from "react-redux";
import {RootState} from "../Types/types";

const NoTasks = () => {
    /*
      <>
            <div className="flex ml-12 space-x-4 text-2xl font-semibold pb-4 mt-6 w-full">
                <h1>Welcome,</h1>
                <p>{userInfo.firstName}</p>
                <p>{userInfo.lastName}</p>
            </div>
            <div className="flex flex-col ml-12 mt-4 bg-white mx-8 p-4 rounded-xl">
                <div className=" h-[300px] p-4">
                    <h1 className="text-2xl font-semibold mb-6">My Tasks</h1>
                    <div className="flex flex-col justify-center items-center">
                        <img src={Image} alt=""/>
                        <p>You have no tasks.</p>
                    </div>
                </div>
            </div>
        </>
     */
    const userInfo = useSelector((state: RootState) => state.userInfo)
    const names = {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName
    }
    return (
        <>
            <View style={style.namesView}>
                <Text style={style.text}>Welcome {names.firstName} {names.lastName}</Text>
            </View>
            <View style={style.container}>
                <View style={style.childContainer}>
                    <Text style={style.text}>My Tasks</Text>
                    <View style={style.imageView}>
                        <Image source={require('../Images/no_tasks.png')} style={style.image}/>
                        <Text style={{fontSize: 16}}>You have no tasks</Text>
                    </View>
                </View>
            </View>
        </>
    )
}
const style = StyleSheet.create({
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