import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from "react-native";
import {Job, RootStackParamList, RootState} from "@/app/Types/types";
import {useEffect, useState} from "react";
import {StackNavigationProp} from "@react-navigation/stack";
import getJobById from "@/app/fetchRequests/getJobById";
import {useSelector} from "react-redux";
import {format} from "date-fns";
import {hidden} from "colorette";
import {Scroll} from "lucide-react-native";

type UploadedJobsNavigationProp = StackNavigationProp<RootStackParamList, 'UploadedJobs'>

const DisplayUploadedJobs = ({uploadedJobs, employerEmail, navigation}: {
    uploadedJobs: Job[];
    employerEmail: string,
    navigation: UploadedJobsNavigationProp
}) => {

    /*
    idea here is to display the jobs by simply using job id the name of the job, the job poster then when a user clicks on the job, then display a modal
    presentation that gives description of the job such as location, requirements, job type, work-place type and so on.
     */
    const numberOfActiveJobs = uploadedJobs.map(job => job.jobStatus === 'active').length
    const [jobById, setJobById] = useState<Job>()
    const [clicked, setClicked] = useState<Record<string, boolean>>({})
    const [loading, setLoading] = useState(false)

    const userInfo = useSelector((state: RootState) => state.userInfo)
    const [name, setName] = useState({
        firstName: userInfo.firstName,
        lastName: userInfo.lastName
    })

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
            if (!response.ok) {
                throw new Error('Failed fetch the job')
            }
            const data = await response.json()
            setJobById(data)

            if (clicked[jobId]) return
            setClicked({[jobId]: true})
        } catch (err) {
            console.error('Error fetching job by ID: ', err)
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
            // navigate(`${firstActiveJob.jobId}`)
            setClicked({[firstActiveJob.jobId]: true})
        }
    }, [navigation, uploadedJobs]);

    /*
    return (
        <div className="flex h-screen my-8">
            {loading && (
                <div className="fixed flex justify-center items-center inset-0 backdrop-brightness-50">
                    <ScaleLoader
                        color="#1c3e17"
                        height={100}
                        width={4}
                    />
                </div>
            )}
            <div className="flex h-[700px] pr-4">
                <div className="cursor-pointer overflow-y-scroll h-screen w-[700px] mr-4">
                    {sortedUploadedJobs.map((job) => (
                        job.jobStatus === 'active' && (
                            <div
                                key={job.jobId}
                                className={`${clicked[job.jobId] ? "border border-[#367c2b] rounded-lg" : ""} p-6 ml-8 my-8 hover:cursor-pointer`}
                                onClick={() => handleFetchJobById(job.jobId)}
                            >
                                <div className="flex font-semibold space-x-2">
                                    <h1>{job.jobId}</h1>
                                    <h1>{job.position}</h1>
                                </div>
                                <div className="flex space-x-2 my-4">
                                    <div className="flex">
                                        <p>{name.firstName}</p>
                                        <p>{name.lastName}</p>
                                    </div>
                                    <p>{job.location}</p>
                                </div>
                            </div>
                        )
                    ))}
                </div>
                {jobById && <JobDetails job={jobById} name={name} role={'Employer'}/>}
            </div>
        </div>
    );
     */

//     <div className="flex h-[700px] pr-4">
//         <div className="cursor-pointer overflow-y-scroll h-screen w-[700px] mr-4">
//         {sortedUploadedJobs.map((job) => (
//                 job.jobStatus === 'active' && (
//                     <div
//                         key={job.jobId}
//                         className={`${clicked[job.jobId] ? "border border-[#367c2b] rounded-lg" : ""} p-6 ml-8 my-8 hover:cursor-pointer`}
//                         onClick={() => handleFetchJobById(job.jobId)}
//                     >
//                         <div className="flex font-semibold space-x-2">
//                             <h1>{job.jobId}</h1>
//                             <h1>{job.position}</h1>
//                         </div>
//                         <div className="flex space-x-2 my-4">
//                             <div className="flex">
//                                 <p>{name.firstName}</p>
//                                 <p>{name.lastName}</p>
//                             </div>
//                             <p>{job.location}</p>
//                         </div>
//                     </div>
//                 )
//             ))}
// </div>
//     {
//         jobById && <JobDetails job={jobById} name={name} role={'Employer'}/>
//     }
    const daysUploaded = (postedDate: string) => {
        const date = new Date().toISOString()
        const formattedDate = format(date, 'MM-dd-yyy')

        const appliedDate = new Date(postedDate)
        const currDate = new Date(formattedDate)

        const timeDifference = currDate.getTime() - appliedDate.getTime()
        const daysDifference = timeDifference / (1000 * 60 * 60 * 24)
        return `Uploaded ${daysDifference > 0 ? (daysDifference + ` Day${daysDifference !== 1 ? "s" : ""} ago`) : "less than a day ago"}`
    }
    const handleShowModal = ()=> {
        console.log('Modal will be shown shortly')
    }
    return (
        <ScrollView>
            <View>
                <View style={styles.containerParent}>
                    <Text style={styles.numberOfJobsHeader}>{numberOfActiveJobs} {numberOfActiveJobs > 1 ? "jobs" : "job"} found</Text>
                    {sortedUploadedJobs.map((job) => (
                        job.jobStatus === 'active' && (
                            //in the below view apply styling based on the clicked div
                            //${clicked[job.jobId] ? "border border-[#367c2b] rounded-lg" : ""}
                            <TouchableOpacity key={job.jobId}
                                              style={[styles.containers, clicked[job.jobId] ? {
                                                  borderWidth: 1,
                                                  borderColor: '#367c2b',
                                                  borderRadius: 8
                                              } : {borderBottomWidth: 0.4}]}
                                              onPress={() => handleFetchJobById(job.jobId)}>
                                <View style={{flexDirection: "row", gap: 16, marginBottom: 6}}>
                                    <Text style={{color: "#5e6a75", fontWeight: "bold", fontSize: 16, textDecorationLine: "underline"}} onPress={()=> handleShowModal()}>{job.position}</Text>
                                </View>
                                <View style={{flexDirection: "row", gap: 20, marginVertical: 10}}>
                                    <View style={{flexDirection: "row", gap: 6}}>
                                        <Text style={{fontSize: 16}}>{name.firstName}</Text>
                                        <Text style={{fontSize: 16}}>{name.lastName}</Text>
                                    </View>
                                    <Text style={{width: 120, fontSize: 14}}>{job.location}</Text>
                                </View>
                                <Text style={{fontSize: 15, fontStyle: "italic"}}>{daysUploaded(job.postedDate)}</Text>
                                <Text style={{color: "#5e6a75", marginTop: 10, fontWeight: "bold"}}>{job.jobId}</Text>
                            </TouchableOpacity>
                        )
                    ))}
                </View>
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    containerParent: {
        padding: 24,
        gap: 12
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
        borderBottomColor: "red",
        paddingBottom: 10,
    }
})
export default DisplayUploadedJobs