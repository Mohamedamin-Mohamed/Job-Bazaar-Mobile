import {ActivityIndicator, ScrollView, StyleSheet, View} from "react-native";
import {Referral, RootStackParamList, RootState} from "@/Types/types";
import NoAvailableReferrals from "./NoAvailableReferrals";
import ReferralItem from "./ReferralItem";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import getReferrals from "@/app/FetchRequests/getReferrals";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";

type MyReferralsNavigationProp = NativeStackScreenProps<RootStackParamList, 'MyReferrals'>

const MyReferrals = ({navigation}: MyReferralsNavigationProp) => {

    const [referrals, setReferrals] = useState<Referral[]>([])
    const applicantEmail = useSelector((state: RootState) => state.userInfo).email
    const [loading, setLoading] = useState(true)

    const fetchReferrals = async (controller: AbortController) => {
        try {
            const response = await getReferrals(applicantEmail, controller)
            if (response.ok) {
                const data = await response.json()
                setReferrals(data)
            }
        } catch (err) {
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const controller = new AbortController()
        fetchReferrals(controller).catch(err => {
            if (!(err instanceof DOMException && err.name === 'AbortError')) {
                console.error(err)
            }
        })
        return () => {
            controller.abort()
        }
    }, []);

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
        loading ? <ActivityIndicator size="large" color="#367c2b" style={styles.activityBar}/> :
            <View style={{flex: 1, flexDirection: "column", marginHorizontal: 36}}>

            {referrals.length === 0 ? (
                    <NoAvailableReferrals navigation={navigation}/>
                ) : (
                    <ScrollView>
                        <View style={{marginTop: 24}}>
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
const styles = StyleSheet.create({
    activityBar: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})
export default MyReferrals;
