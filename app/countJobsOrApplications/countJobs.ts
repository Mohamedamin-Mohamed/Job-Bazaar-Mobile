 import {Job} from "../Types/types";

const countJobs = (jobs: Job[]) => {
    return jobs.filter(job => job.jobStatus === 'active').length
}
export default countJobs