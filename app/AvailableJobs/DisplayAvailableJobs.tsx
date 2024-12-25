import {ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Job, RootStackParamList, RootState} from "../Types/types";
import {useEffect, useState} from "react";
import {StackNavigationProp} from "@react-navigation/stack";
import getJobById from "../fetchRequests/getJobById";
import {useSelector} from "react-redux";
import JobsModal from "../Modals/JobsModal";
import daysFromUploadedDate from "../Utilities/daysFromUploadedDate";

type AvailableJobsNavigationProp = StackNavigationProp<RootStackParamList, 'AvailableJobs'>

const DisplayAvailableJobs = ({availableJobs, navigation}: {
    availableJobs: Job[];
    navigation: AvailableJobsNavigationProp
}) => {

    const initialJobDetails: Job = {
        position: '',
        company: '',
        workPlace: '',
        location: '',
        jobFunction: '',
        jobType: '',
        description: '',
        requirements: '',
        employerEmail: '',
        jobId: '',
        jobStatus: '',
        postedDate: '',
    }

    const numberOfActiveJobs = availableJobs.filter(job => job.jobStatus === 'active').length

    const [jobById, setJobById] = useState<Job>(initialJobDetails)
    const [clicked, setClicked] = useState<Record<string, boolean>>({})
    const [loading, setLoading] = useState(false)

    const userInfo = useSelector((state: RootState) => state.userInfo)
    const role = userInfo.role

    const [displayModal, setDisplayModal] = useState(false)

    const parseDate = (date: string) => {
        const [month, day, year] = date.split('-').map(Number)
        return new Date(year, month - 1, day)
    }

    const sortedUploadedJobs = [...availableJobs].sort((a, b) => {
        const dateA = parseDate(a.postedDate).getTime()
        const dateB = parseDate(b.postedDate).getTime()

        return dateB - dateA
    })

    const handleFetchJobById = async (employerEmail: string, jobId: string) => {
        setLoading(true)
        try {
            const controller = new AbortController()
            const response = await getJobById(employerEmail, jobId, controller)
            if (response.ok) {
                const data = await response.json()
                setJobById(data)
            }
            if (clicked[jobId]) return
            setClicked({[jobId]: true})
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (availableJobs.length > 0) {
            const firstActiveJob = availableJobs.filter(job => job.jobStatus === "active").sort((a, b) => {
                const dateA = parseDate(a.postedDate).getTime()
                const dateB = parseDate(b.postedDate).getTime()
                return dateB - dateA
            })[0] //filter by only selecting active jobs then sort the filter jobs by their posting date returning the most recent one

            setJobById(firstActiveJob)
            setClicked({[firstActiveJob.jobId]: true})
        }
    }, [navigation, availableJobs]);


    const handleShowModal = (job: Job) => {
        setClicked({[job.jobId]: true})
        setJobById(job)
        handleDisplayModel()
    }
    const handleDisplayModel = () => {
        setDisplayModal(!displayModal)
    }
    return (
        !loading ?
            <ScrollView>
                <View style={styles.containerParent}>
                    <Text
                        style={styles.numberOfJobsHeader}>{numberOfActiveJobs} {numberOfActiveJobs > 1 ? "jobs" : "job"} found</Text>
                    {sortedUploadedJobs.map((job) => (
                        job.jobStatus === 'active' && (
                            <TouchableOpacity key={job.jobId}
                                              style={[styles.containers, clicked[job.jobId] ? {
                                                  borderWidth: 1,
                                                  borderColor: '#367c2b',
                                                  borderRadius: 8
                                              } : {borderBottomWidth: 0.4}]}
                                              onPress={() => handleFetchJobById(job.employerEmail, job.jobId)}>
                                <TouchableOpacity style={{flexDirection: "row", gap: 16, marginBottom: 6}}>
                                    <Text style={{
                                        color: "#5e6a75",
                                        fontWeight: "bold",
                                        fontSize: 16,
                                        textDecorationLine: "underline"
                                    }} onPress={() => handleShowModal(job)}>{job.position}</Text>
                                </TouchableOpacity>
                                <View style={{flexDirection: "row", gap: 20, marginVertical: 10}}>
                                    <Text style={{fontSize: 16}}>{job.location}</Text>
                                </View>
                                <Text style={{
                                    fontSize: 15,
                                    fontStyle: "italic"
                                }}>{daysFromUploadedDate(job.postedDate)}</Text>
                                <Text
                                    style={{color: "#5e6a75", marginTop: 10, fontWeight: "bold"}}>{job.jobId}</Text>
                            </TouchableOpacity>
                        )
                    ))}
                    {displayModal && <JobsModal job={jobById} handleDisplayModel={handleDisplayModel} role={role}
                                                navigation={navigation}/>}
                </View>
            </ScrollView>
            :
            <ActivityIndicator size="large" color="#367c2b"/>
    )
}
const styles = StyleSheet.create({
    containerParent: {
        padding: 24,
        gap: 12,
        backgroundColor: "white"
    },
    containers: {
        padding: 16,
        marginBottom: 8,
    },
    numberOfJobsHeader: {
        color: "#5e6a75",
        fontWeight: "bold",
        marginLeft: 2,
        fontSize: 18,
        marginBottom: 12,
        borderBottomWidth: 0.4,
        paddingBottom: 10,
    }
})
export default DisplayAvailableJobs