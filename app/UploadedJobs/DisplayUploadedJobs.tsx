import {View, Text} from "react-native";
import {Job, RootStackParamList} from "@/app/Types/types";
import {useState} from "react";
import {StackNavigationProp} from "@react-navigation/stack";

type UploadedJobsNavigationProp = StackNavigationProp<RootStackParamList, 'UploadedJobs'>

const DisplayUploadedJobs = ({uploadedJobs, employerEmail, navigation}: { uploadedJobs: Job[]; employerEmail: string, navigation: UploadedJobsNavigationProp}) => {

    /*
    idea here is to display the jobs by simply using job id the name of the job, the job poster then when a user clicks on the job, then display a modal
    presentation that gives description of the job such as location, requirements, job type, work-place type and so on.
     */
    // const [jobById, setJobById] = useState()
    // const [clicked, setClicked] = useState({})
    // const [loading, setLoading] = useState(false)
    //
    // const [name, setName] = useState({
    //     firstName: '',
    //     lastName: ''
    // })
    //
    // const parseDate = (date: string) => {
    //     const [month, day, year] = date.split('-').map(Number)
    //     return new Date(year, month - 1, day)
    // }
    // const sortedUploadedJobs = [...uploadedJobs].sort((a, b) => {
    //     const dateA = parseDate(a.postedDate).getTime()
    //     const dateB = parseDate(b.postedDate).getTime()
    //
    //     return dateB - dateA
    // })
    //
    // const handleFetchJobById = async (jobId: string) => {
    //     try {
    //         const controller = new AbortController()
    //         const token = localStorage.getItem('token')
    //         const response = await fetch(`http://localhost:8080/api/jobs/${employerEmail}/${jobId}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             },
    //             signal: controller.signal
    //         })
    //
    //         if (!response.ok) {
    //             throw new Error('Failed fetch the job')
    //         }
    //         const data = await response.json()
    //         setJobById(data)
    //
    //         if (clicked[jobId]) return
    //
    //         setClicked((prevState) => ({
    //             [jobId]: true
    //         }))
    //         // navigation.navigate(`${jobId}`)
    //     } catch (err) {
    //         console.error('Error fetching job by ID: ', err)
    //     }
    // }
    //
    // useEffect(() => {
    //     if (uploadedJobs.length > 0) {
    //         const firstActiveJob = uploadedJobs.filter(job => job.jobStatus === "active").sort((a, b) => {
    //             const dateA = parseDate(a.postedDate)
    //             const dateB = parseDate(b.postedDate)
    //             return dateB - dateA
    //         })[0] //filter by only selecting active jobs then sort the filter jobs by their posting date returning the most recent one
    //
    //         setJobById(firstActiveJob)
    //         navigate(`${firstActiveJob.jobId}`)
    //         setClicked((prevState) => ({
    //             [firstActiveJob.jobId]: true
    //         }))
    //     }
    // }, [navigate, uploadedJobs]);
    //
    // useEffect(() => {
    //     setLoading(true)
    //     const fetchName = async () => {
    //         const response = await GetName(employerEmail, new AbortController())
    //         const data = await response.json()
    //         setName({
    //             firstName: data.firstName,
    //             lastName: data.lastName
    //         })
    //         setLoading(false)
    //     }
    //     fetchName().catch(err => console.error(err))
    // }, [employerEmail]);

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
    console.log('Uploaded Jobs are ', uploadedJobs)
    return (
        <View>
            <Text>
                Under Construction
            </Text>
        </View>
    )
}
export default DisplayUploadedJobs