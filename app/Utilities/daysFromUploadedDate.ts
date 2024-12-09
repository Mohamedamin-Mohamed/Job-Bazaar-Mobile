import {differenceInDays, parse} from "date-fns";

const daysFromUploadedDate = (postedDate: string) => {
    const appliedDate = parse(postedDate, 'MM-dd-yyyy', new Date());
    const currDate = new Date()

    const daysDifference = differenceInDays(currDate, appliedDate)
    return `Uploaded ${daysDifference > 0 ? (daysDifference + ` Day${daysDifference !== 1 ? "s" : ""} ago`) : "less than a day ago"}`
}
export default daysFromUploadedDate