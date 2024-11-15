import {Application} from "@/app/Types/types";

const countActivepplications = (applications: Application[]) => {
    return applications.filter(app => app.isActive === 'true').length
}
export default countActivepplications