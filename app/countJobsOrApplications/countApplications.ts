import { Application } from "../Types/types";

const countApplications = (applications: Application[]) => {
    const active = applications.filter((job) => job.isActive === "active").length;
    const inactive = applications.filter((job) => job.isActive === "inactive").length;
    return { active, inactive };
};
