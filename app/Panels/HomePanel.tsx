import {
    ActivityIndicator,
    Image,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {useEffect, useState} from "react";
import emailValidation from "../Regex/emailValidation";
import emailLookup from "../fetchRequests/emailLookup";
import {useDispatch, useSelector} from "react-redux";
import {setUserInfo} from "../Redux/userSlice";
import {RootStackParamList, RootState} from "../Types/types";
import {StackNavigationProp} from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

type HomePanelNavigationProp = StackNavigationProp<RootStackParamList, 'HomePanel'>

const HomePanel = ({navigation}: { navigation: HomePanelNavigationProp }) => {
    const [loading, setLoading] = useState(false)
    const userInfo = useSelector((state: RootState) => state.userInfo)
    const dispatch = useDispatch()

    const [email, setEmail] = useState(userInfo.email)
    const [err, setErr] = useState('')

    const handleEmail = async () => {
        if (!email) {
            setErr('Email is mandatory.')
            return
        }
        const valid = emailValidation(email)
        if (!valid) {
            setErr('Email is not valid.')
            return;
        }
        setErr('')

        try {
            setLoading(true)
            //check if the users email exits and then based on that redirect the user to either of the accounts panel
            const emailVerify = await emailLookup(email)
            dispatch(setUserInfo({email: email}))

            if (emailVerify.ok) {
                navigation.navigate('LoginPanel')
            } else {
                navigation.navigate('CreateAccount')
            }
        } catch (exp) {
            throw exp
        } finally {
            setLoading(false)
        }
    }

    const fetchToken = async () => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            navigation.navigate("CareerHub");
        }
    }

    useEffect(() => {
        return navigation.addListener('focus', () => {
            fetchToken().catch(err => {
                console.error(err);
            });
        });
    }, [navigation]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

            <View style={styles.container}>
                <View style={styles.parentView}>
                    <Text style={styles.mainText}>Job Bazaar</Text>
                </View>
                <Text style={styles.header}>Your work people are here</Text>
                <View style={styles.imageView}>
                    <Image source={require('../Images/b.png')} style={styles.firstImage}/>
                </View>
                <View style={styles.childContainer}>
                    <View>
                        <Text style={{fontSize: 17, padding: 10, fontWeight: "bold", textAlign: "center"}}>Create
                            an
                            account
                            or sign in</Text>
                        <View>
                            <TouchableOpacity>
                                <Text style={styles.sameButtons}>Continue with Google</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={styles.sameButtons}>Continue with GitHub</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{fontWeight: "bold", paddingVertical: 10, marginLeft: 6}}>Enter
                            Email</Text>
                        <TextInput autoCapitalize="none" style={styles.inputEmail} keyboardType="email-address"
                                   onChangeText={text => setEmail(text)} value={email}/>
                        <View>
                            {err && <Text style={styles.errorText}>{err}</Text>}
                        </View>
                        <TouchableOpacity onPress={handleEmail}>
                            {
                                loading ?
                                    <ActivityIndicator size="small" color="#367c2b"
                                                       style={styles.continueEmail}/> :
                                    <Text style={styles.continueEmail}>Continue with email</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.bottomParentButton}>
                    <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                        <Text style={styles.underlinedButton}>Join now</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.underlinedButton}>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        display: "flex"
    },
    parentView: {
        justifyContent: "space-between",
        flexDirection: "row"
    },
    mainText: {
        textAlign: "center",
        color: "#367c2b",
        fontSize: 28,
        fontWeight: "bold",
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    header: {
        color: "#367c2b",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 25,
        paddingTop: 20,
        borderStyle: "solid",
        borderTopWidth: 2
    },
    parentButton: {
        flexDirection: "row",
        paddingVertical: 25,
        display: "flex",
        paddingRight: 15,
    },
    joinButton: {
        color: "#367c2b",
        fontWeight: "bold",
        fontSize: 18,
        paddingTop: 5
    },
    signInButton: {
        color: "#367c2b",
        fontWeight: "bold",
        fontSize: 18,
        borderColor: "#367c2b",
        borderWidth: 1.8,
        padding: 6,
        borderRadius: 6
    },
    signInHovered: {
        backgroundColor: "#36722b"
    },
    bottomParentButton: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-evenly",
        paddingBottom: 10
    },
    underlinedButton: {
        textDecorationLine: "underline",
        color: "#367c2b",
        fontWeight: "bold",
        fontSize: 18
    },
    childContainer: {
        flex: 0.7,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20
    },
    sameButtons: {
        width: 300,
        padding: 10,
        margin: 4,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 6,
        textAlign: "center",
        fontSize: 16
    },
    inputEmail: {
        width: 300,
        padding: 10,
        margin: 4,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 6,
        fontSize: 16,
    },
    continueEmail: {
        width: 300,
        padding: 10,
        margin: 4,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 6,
        textAlign: "center",
        color: "#367c2b",
        fontWeight: "bold",
        fontSize: 16
    },
    errorText: {
        color: "#bd332a",
        fontSize: 16,
        textAlign: "left",
        marginLeft: 6,
        marginVertical: 4
    },
    emailWrong: {
        borderColor: "#fff1f0",
        backgroundColor: "fff1f0"
    },
    imageView: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 30
    },
    firstImage: {
        width: 190,
        height: 160,
    }
})
export default HomePanel