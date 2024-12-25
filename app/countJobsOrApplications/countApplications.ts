import {Application} from "../Types/types";

const countApplications = (applications: Application[], jobStatuses: Record<string, string> | undefined) => {
    // Ensure jobStatuses is an object and provide a fallback
    const safeJobStatuses = jobStatuses || {};

    const active = applications.filter(
        (app) => app.isActive === "true" && (safeJobStatuses[app.jobId] ?? 'active') === 'active'
    ).length;

    const inactive = applications.filter(
        (app) => app.isActive === "false" || (safeJobStatuses[app.jobId] ?? 'inActive') === 'inActive'
    ).length;

    return {active, inactive};
};

export default countApplications;
