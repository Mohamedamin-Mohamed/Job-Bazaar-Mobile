import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useState} from "react";
import {format} from "date-fns";
import DateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker"
import Icon from "react-native-vector-icons/MaterialIcons";

interface DateRangeProps {
    setStartDate: (date: Date) => void,
    setEndDate: (date: Date) => void,
    dates: {
        startDate: Date,
        endDate: Date
    }
}

const DateRange = ({setStartDate, setEndDate, dates}: DateRangeProps) => {
    const [showStartPicker, setShowStartPicker] = useState(false)
    const [showEndPicker, setShowEndPicker] = useState(false)

    const [isVisible, setIsVisible] = useState(true)
    const handleStartDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowStartPicker(false);
        if (selectedDate) {
            setStartDate(selectedDate);
        }
    };

    const handleEndDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowEndPicker(false);
        if (selectedDate) {
            setEndDate(selectedDate);
        }
    }

    const getFormattedDate = (date: Date) => {
        return dates.startDate ? format(date, 'yyy-MM-dd') : ''
    }

    const handleToggle = (type: string) => {
        if (type === 'start') {
            setShowEndPicker(false)
            setShowStartPicker(true)
        } else {
            setShowStartPicker(false)
            setShowEndPicker(true)
        }
    }

    const handleCalendarsHide = () => {
        setShowStartPicker(false)
        setShowEndPicker(false)
    }

    return (
        <View style={styles.container}>
            <View style={styles.childContainer}>
                <View style={{padding: 10}}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.headerView} onPress={() => {
                        setIsVisible(!isVisible)
                        handleCalendarsHide()
                    }}>
                        <Text style={styles.headerText}>Date Range</Text>
                        <Icon name={!isVisible ? "chevron-right" : "expand-more"} size={30} color="gray"/>

                    </TouchableOpacity>

                    <View style={[{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center"
                    }, !isVisible && {display: "none"}]}>
                        <TouchableOpacity activeOpacity={0.8}
                                          style={styles.button}
                                          onPress={() => handleToggle('start')}>
                            <Text style={styles.buttonText}>{getFormattedDate(dates.startDate)}</Text>
                        </TouchableOpacity>

                        <Icon name="arrow-right-alt" size={24}/>
                        <TouchableOpacity activeOpacity={0.8}
                                          style={styles.button}
                                          onPress={() => handleToggle('end')}>
                            <Text style={styles.buttonText}>{getFormattedDate(dates.endDate)}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.calenderView}>
                    <TouchableOpacity onPress={handleCalendarsHide} >
                        {showStartPicker && (
                            <DateTimePicker
                                value={dates.startDate}
                                mode="date"
                                display="inline"
                                onChange={handleStartDateChange}
                                style={{backgroundColor: "white", top: 20}}
                            />
                        )}
                        {showEndPicker && (
                            <DateTimePicker
                                value={dates.endDate}
                                mode="date"
                                display="inline"
                                onChange={handleEndDateChange}
                                style={{backgroundColor: "white", top: 20}}
                            />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#f5f5f5",
        marginTop: 20
    },
    childContainer: {
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "white"
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 10,
    },
    buttonText: {
        fontWeight: "400",
        fontSize: 20,
        color: "#007AFF",
    },
    headerView: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%"
    },
    headerText: {
        marginLeft: 12,
        fontSize: 22,
        fontWeight: "500",
        padding: 4
    },
    calenderView: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        top: 100,
        zIndex: 100,
        marginTop: 20,
    }
})
export default DateRange