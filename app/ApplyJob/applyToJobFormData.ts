import {format} from "date-fns";
import {JobApplication, User} from "../Types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const applyToJobFormData = async (jobApplication: JobApplication, user: User) => {
    const token = await AsyncStorage.getItem('token')
    if (!token) {
        throw new Error('No token available')
    }
    const formData = new FormData();

    formData.append("applicantEmail", user.email);
    formData.append("employerEmail", jobApplication.employerEmail);
    formData.append("jobId", jobApplication.jobId);
    formData.append("position", jobApplication.position)

    if (jobApplication.resume.name) {
        formData.append("resumeName", jobApplication.resume.name)
    }

    formData.append("resumeFile", {
        uri: jobApplication.resume.file?.fileUri,
        name: jobApplication.resume.name,
        type: jobApplication.resume.file?.mimeType
    } as any)

    formData.append("country", jobApplication.country)
    formData.append("city", jobApplication.city)
    formData.append("postalCode", jobApplication.postalCode)
    formData.append("gender", jobApplication.gender)
    formData.append("nationality", jobApplication.nationality)

    if (jobApplication.additionalDocument.name) {
        formData.append("additionalDocName", jobApplication.additionalDocument.name)
        formData.append("additionalDocFile", {
            uri: jobApplication.additionalDocument.file?.fileUri,
            name: jobApplication.additionalDocument.name,
            type: jobApplication.additionalDocument.file?.mimeType
        } as any)
    }

    formData.append("employerContact", jobApplication.employerContact)
    formData.append("firstName", user.firstName)
    formData.append("applicationStatus", "In Progress")
    formData.append("isActive", "true")
    formData.append("lastName", user.lastName)

    const formattedDate = format(new Date().toISOString(), 'MM-dd-yyy')
    formData.append("applicationDate", formattedDate)

    return formData
}
export default applyToJobFormData