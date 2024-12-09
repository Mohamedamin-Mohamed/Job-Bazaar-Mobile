import {differenceInDays, parse} from "date-fns";

const daysFromAppliedDate = (date: string)=> {
    const appliedDate = parse(date, 'MM-dd-yyyy', new Date());
    const currDate = new Date()

    const daysDifference = differenceInDays(currDate, appliedDate)
    return `Applied ${daysDifference > 0 ? (daysDifference + ` Day${daysDifference !== 1 ? "s" : ""} ago`) : "less than a day ago"}`
}
export default daysFromAppliedDate