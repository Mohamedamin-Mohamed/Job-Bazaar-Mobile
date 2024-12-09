import {ScrollView, View} from "react-native";
import {Referral, RootStackParamList} from "../Types/types";
import NoAvailableReferrals from "./NoAvailableReferrals";
import ReferralItem from "./ReferralItem";
import {NativeStackScreenProps} from "@react-navigation/native-stack";

type MyReferralsNavigationProp = NativeStackScreenProps<RootStackParamList, 'MyReferrals'>

const MyReferrals = ({route, navigation}: MyReferralsNavigationProp) => {
    const {referrals}: { referrals: Referral[] | null} = route.params

    const parseDate = (createdDate: string) => {
        const [month, year, day] = createdDate.split('-').map(Number)
        return new Date(year, month - 1, day)
    }
    const sortByCreatedDate = [...referrals].sort((a, b) => {
        const dateA = parseDate(a.createdAt).getTime()
        const dateB = parseDate(b.createdAt).getTime()
        return dateB - dateA
    })

    return (
        <View style={{flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            {referrals.length === 0 ? (
                <NoAvailableReferrals navigation={navigation}/>
            ) : (
                <ScrollView>
                    <View style={{justifyContent: "center", alignItems: "center", marginTop: 24}}>
                        {sortByCreatedDate.map((referral,) => (
                            <View key={referral.fileName} style={{width: "100%"}}>
                                <ReferralItem referral={referral}/>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

export default MyReferrals;
