import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Job, RootStackParamList, RootState} from "../Types/types";
import {useEffect, useState} from "react";
import {StackNavigationProp} from "@react-navigation/stack";
import getJobById from "../fetchRequests/getJobById";
import {useSelector} from "react-redux";
import JobsModal from "../Modals/JobsModal";
import daysFromUploadedDate from "../Utilities/daysFromUploadedDate";


type UploadedJobsNavigationProp = StackNavigationProp<RootStackParamList, 'UploadedJobs'>
const DisplayUploadedJobs = ({uploadedJobs, employerEmail, navigation}: {
    uploadedJobs: Job[];
    employerEmail: string,
    navigation: UploadedJobsNavigationProp
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
    const numberOfActiveJobs = uploadedJobs.filter(job => job.jobStatus === 'active').length
    const [jobById, setJobById] = useState<Job>(initialJobDetails)
    const [clicked, setClicked] = useState<Record<string, boolean>>({})

    const userInfo = useSelector((state: RootState) => state.userInfo)
    const role = userInfo.role
    const name = {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName
    }

    const [displayModal, setDisplayModal] = useState(false)

    const parseDate = (date: string) => {
        const [month, day, year] = date.split('-').map(Number)
        return new Date(year, month - 1, day)
    }

    const sortedUploadedJobs = [...uploadedJobs].sort((a, b) => {
        const dateA = parseDate(a.postedDate).getTime()
        const dateB = parseDate(b.postedDate).getTime()

        return dateB - dateA
    })

    const handleFetchJobById = async (jobId: string) => {
        try {
            const controller = new AbortController()
            const response = await getJobById(employerEmail, jobId, controller)
            if (response.ok) {
                const data = await response.json()
                setJobById(data)
            }

            if (clicked[jobId]) return
            setClicked({[jobId]: true})
        } catch (exp) {
            console.error(exp)
        }
    }

    useEffect(() => {
        if (uploadedJobs.length > 0) {
            const firstActiveJob = uploadedJobs.filter(job => job.jobStatus === "active").sort((a, b) => {
                const dateA = parseDate(a.postedDate).getTime()
                const dateB = parseDate(b.postedDate).getTime()
                return dateB - dateA
            })[0] //filter by only selecting active jobs then sort the filter jobs by their posting date returning the most recent one

            setJobById(firstActiveJob)
            setClicked({[firstActiveJob.jobId]: true})
        }
    }, [navigation, uploadedJobs])

    const handleShowModal = (job: Job) => {
        setClicked({[job.jobId]: true})
        setJobById(job)
        handleDisplayModel()
    }
    const handleDisplayModel = () => {
        setDisplayModal(!displayModal)
    }
    return (
        <ScrollView>
            <View>
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
                                              onPress={() => handleFetchJobById(job.jobId)}>
                                <TouchableOpacity style={{flexDirection: "row", gap: 16, marginBottom: 6}}>
                                    <Text style={{
                                        color: "#5e6a75",
                                        fontWeight: "bold",
                                        fontSize: 16,
                                        textDecorationLine: "underline"
                                    }} onPress={() => handleShowModal(job)}>{job.position}</Text>
                                </TouchableOpacity>
                                <View style={{flexDirection: "row", gap: 20, marginVertical: 10}}>
                                    <View style={{flexDirection: "row", gap: 6}}>
                                        <Text style={{fontSize: 16}}>{name.firstName}</Text>
                                        <Text style={{fontSize: 16}}>{name.lastName}</Text>
                                    </View>
                                    <Text style={{width: 120, fontSize: 14}}>{job.location}</Text>
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
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    containerParent: {
        backgroundColor: "white",
        padding: 24,
        gap: 12,
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
        borderBottomWidth: 1,
        borderBottomColor: "gray",
        paddingBottom: 10,
    }
})
export default DisplayUploadedJobs