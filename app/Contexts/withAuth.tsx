import {ComponentType, useEffect} from "react";
import useAuth from "@/app/Contexts/useAuth";
import {NavigationProp} from "@react-navigation/core";
import {RootStackParamList} from "@/Types/types";
import {ActivityIndicator, StyleSheet} from "react-native";

const withAuth = <P extends { navigation: NavigationProp<RootStackParamList> }>
(WrappedComponent: ComponentType<P>) => {
    return (props: P) => {
        const {checkTokenValidity, isValidating} = useAuth();

        useEffect(() => {
            const checkToken = async () => {
                try {
                    await checkTokenValidity(props.navigation);
                } catch (err) {
                    console.error(err);
                }
            };

            const unsubscribe = props.navigation.addListener("focus", checkToken);

            return () => {
                unsubscribe();
            };
        }, [props.navigation, checkTokenValidity]);

        if (isValidating) {
            return (
                <ActivityIndicator
                    size="large"
                    color="#367c2b"
                    style={styles.indicator}
                />
            );
        }

        return <WrappedComponent {...props} />;
    };
};

const styles = StyleSheet.create({
    indicator: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default withAuth;
