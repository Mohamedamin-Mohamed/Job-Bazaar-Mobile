import {Application} from "@/app/Types/types";

const countInactiveApplications = (applications: Application[]) => {
    return applications.filter(app => app.isActive === 'false').length
}
export default countInactiveApplications