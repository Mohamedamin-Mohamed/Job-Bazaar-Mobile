import {Resume, User} from "../Types/types";
import {format} from "date-fns";

const referralFormData = (resumeDetails: Resume, userInfo: User) => {
    const date = new Date()
    const formattedDate = format(date, 'MM-yyyy-dd')
    const fullName = userInfo.firstName + " " + userInfo.lastName
    const formData = new FormData()

    formData.append('referrerName', fullName)
    formData.append('referrerEmail', userInfo.email)
    formData.append('fileName', resumeDetails.name)
    formData.append('createdAt', formattedDate)
    formData.append('refereeResumeFile', resumeDetails as any)

    return formData
}
export default referralFormData