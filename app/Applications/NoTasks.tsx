import {Image, Text, View, StyleSheet} from "react-native";

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
    return (
        <View style={style.container}>
            <View style={style.childContainer}>
                <Text>My Tasks</Text>
                <View style={style.imageView}>
                    <Image source={require('../Images/no_tasks.png')} />
                    <Text>You have no tasks</Text>
                </View>
            </View>
        </View>
    )
}
const style = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center"
    },
    childContainer: {
        backgroundColor: "white",
        borderColor: "white",
        borderRadius: 4,
    },
    imageView: {
        justifyContent: "center",
        alignItems: "center"
    }
})
export default NoTasks