import {Application} from "@/app/Types/types";

const countApplications = (applications: Application[]) => {
    return applications.filter(app => app.isActive === 'true').length
}
export default countApplications