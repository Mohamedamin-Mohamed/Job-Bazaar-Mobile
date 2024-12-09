import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/app/Types/types";
import {Text, View} from "react-native";

type ViewApplicationProps = NativeStackScreenProps<RootStackParamList, 'ViewApplication'>

const ViewApplication = ({route, navigation}: ViewApplicationProps) => {
    const {application} = route.params
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handleDateParsing = (date: string) => {
        const [month, day, year] = date.split('-').map(Number)

        const monthName = month ? monthNames[month - 1] : ''
        return monthName ? `${monthName} ${day}, ${year}` : ''

    }
    return (
        <View>
            <View>
                <Text>{application.position}</Text>
                <View>
                    <Text>You applied for this job on {handleDateParsing(application.applicationDate)}</Text>
                </View>
            </View>
        </View>
    )
}
export default ViewApplication