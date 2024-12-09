import {Application} from "../Types/types";

const countApplications = (applications: Application[]) => {
    const active = applications.filter((app) => app.isActive === "true").length;
    const inactive = applications.filter((app) => app.isActive === "false").length;
    return {active, inactive};
};
export default countApplications