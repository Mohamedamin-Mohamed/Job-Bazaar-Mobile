import {Application} from "@/app/Types/types";

const countActiveApplications = (applications: Application[]) => {
    return applications.filter(app => app.isActive === 'true').length
}
export default countActiveApplications