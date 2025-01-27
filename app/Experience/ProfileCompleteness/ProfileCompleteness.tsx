import {NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {useRef, useState} from "react";
import Resume from "@/app/Experience/ProfileCompleteness/Resume";
import Skills from "@/app/Experience/ProfileCompleteness/Skills";
import Studies from "@/app/Experience/ProfileCompleteness/Studies";
import Goals from "@/app/Experience/ProfileCompleteness/Goals";

const ProfileCompleteness = () => {
    const [expandLess, setExpandLess] = useState(false);
    const [scrollX, setScrollX] = useState(0);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);
    const scrollRef = useRef<ScrollView>(null);

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollX = event.nativeEvent.contentOffset.x;
        setScrollX(scrollX)

        const contentWidth = event.nativeEvent.contentSize.width;
        const layoutWidth = event.nativeEvent.layoutMeasurement.width;

        /* so now we check if scrollX > 0 meaning if we can show the left arrow, and then we check if there is some content
        left to scroll, and we do this by checking if scrollX + layoutWidth < contentWidth. LayoutWidth is the width of
        the content that can fit the viewable screen. */
        setShowLeft(scrollX > 0);
        setShowRight(scrollX + layoutWidth < contentWidth);
    };

    const scrollTo = (distance: number) => {
        scrollRef.current?.scrollTo({
            x: distance + scrollX,
            animated: true
        })
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.headerView}>
                    <Text style={styles.headerText}>Make Career Hub work for you</Text>
                    <Icon name={!expandLess ? "expand-less" : "expand-more"} size={30}
                          onPress={() => setExpandLess(prevState => !prevState)} style={styles.iconStyle}/>
                </View>
                <View style={{alignItems: "center", gap: 20}}>
                    {!expandLess && (
                        <View style={styles.contentContainer}>
                            <Text style={styles.infoText}>
                                Add more to your profile and get recommendations for the career you want.
                            </Text>

                            <ScrollView
                                ref={scrollRef}
                                onScroll={onScroll}
                                scrollEventThrottle={16}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.horizontalScrollContainer}>
                                <View style={styles.scrollContentWrapper}>
                                    <View style={styles.componentWrapper}>
                                        <Resume/>
                                    </View>
                                    <View style={styles.componentWrapper}>
                                        <Skills/>
                                    </View>
                                    <View style={styles.componentWrapper}>
                                        <Studies/>
                                    </View>
                                    <View style={styles.componentWrapper}>
                                        <Goals/>
                                    </View>
                                </View>
                            </ScrollView>
                            {/* Left and Right Scroll Buttons */}
                            {showLeft && (
                                <Icon
                                    name="chevron-left"
                                    size={40}
                                    color="#367c2b"
                                    style={[styles.arrowButton, styles.leftButton]}
                                    onPress={() => scrollTo(-120)}
                                />
                            )}
                            {showRight && (
                                <Icon
                                    name="chevron-right"
                                    size={40}
                                    color="#367c2b"
                                    style={[styles.arrowButton, styles.rightButton]}
                                    onPress={() => scrollTo(120)}
                                />
                            )}
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        padding: 16,
        borderWidth: 0.4,
        borderRadius: 4,
        borderColor: "gray",
        marginVertical: 20,
        width: "96%",
        alignSelf: "center",
    },
    headerView: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },
    headerText: {
        fontSize: 18,
        fontWeight: "500",
    },
    iconStyle: {
        marginLeft: "auto",
    },
    contentContainer: {
        marginTop: 20,
        borderTopWidth: 0.4,
        paddingTop: 20,
    },
    infoText: {
        fontSize: 14,
        marginBottom: 20,
        borderBottomWidth: 0.4,
        paddingBottom: 20,
    },
    horizontalScrollContainer: {
        flexDirection: "row",
        gap: 20,
    },
    scrollContentWrapper: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    componentWrapper: {
        width: 200,
        alignItems: "center",
    },
    arrowButton: {
        position: "absolute",
        top: "50%",
        zIndex: 1,
        backgroundColor: "white",
        borderRadius: 4,
        borderWidth: 0.8,
        borderColor: "#367c2b"
    },
    leftButton: {
        left: 0,
    },
    rightButton: {
        right: 0,

    },
});

export default ProfileCompleteness;
