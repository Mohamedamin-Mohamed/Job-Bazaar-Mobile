import {Job} from "@/Types/types";

const countJobs = (jobs: Job[]) => {
    const active = jobs.filter(job => job.jobStatus === 'active').length
    const inactive = jobs.filter(job => job.jobStatus === 'inActive').length;
    return {active, inactive};
}
export default countJobs