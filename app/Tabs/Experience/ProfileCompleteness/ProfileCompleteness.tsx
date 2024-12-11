import {Text, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {useState} from "react";

const ProfileCompleteness = ()=> {
    const[expandLess, setExpandLess] = useState(false)
    return(
        <View>
            <View>
                <View>
                    <Text>Make Career Hub work for you</Text>
                    <Icon name={expandLess ? "expand-less" : "expand-more"} size={24} onPress={()=> setExpandLess(prevState => !prevState)}/>
                </View>
                <Text>Add more to your profile and get recommendations for the career you want.</Text>

            </View>
        </View>
    )
}
export default ProfileCompleteness