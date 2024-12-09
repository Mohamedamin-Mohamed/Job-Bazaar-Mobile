import exp from "node:constants";

export type RootState = {
    userInfo: User,
    locationInfo: Location
}

export type User = {
    email: string,
    firstName: string,
    lastName: string,
    role: string,
    createdAt: string
}

export type Location = {
    city: string,
    state: string,
    country: string
}

// Define a flexible payload type for setUserInfo
export type SetUserInfoPayload = {
    [K in keyof User]?: User[K]; // This allows each property to be optional
}

export type Job = {
    employerEmail: string,
    jobId: string,
    company: string,
    description: string,
    jobFunction: string,
    jobStatus: string,
    jobType: string,
    location: string,
    position: string,
    postedDate: string,
    requirements: string,
    workPlace: string
}

export type Application = {
    applicantEmail: string,
    jobId: string,
    additionalDocNam: string | null,
    applicationDate: string,
    applicationStatus: string,
    city: string,
    country: string,
    employerContact: string,
    employerEmail: string,
    firstName: string,
    lastName: string,
    gender: string,
    isActive: string,
    nationality: string,
    position: string,
    postalCode: string,
    resumeDetails: Record<string, string> | null,
    resumeName: string
}

export type RootStackParamList = {
    HomePanel: undefined,
    Signup: undefined,
    Login: undefined,
    CreateAccount: undefined,
    LoginPanel: undefined,
    ForgotPassword: undefined,
    ResetPassword: undefined,
    CareerHub: undefined,
    UploadedJobs: undefined,
    CareerInterests: undefined,
    UploadJob: undefined,
    AvailableJobs: undefined,
    Apply: { job: Job },
    Edit: { job: Job },
    MyReferrals: { referrals: Referral[] },
    Refer: undefined,
    AppliedJobs: {jobs: Application[]},
    ViewDescription: {application: Application},
    ViewApplication: {application: Application},
    Feedbacks: undefined
}

export type JobDetails = {
    position: string,
    company: string,
    workPlace: string,
    location: string,
    jobFunction: string,
    jobType: string,
    description: string,
    requirements: string,
}

export type EditJobDetails = {
    employerEmail: string,
    jobId: string,
    position: string,
    company: string,
    workPlace: string,
    location: string,
    jobFunction: string,
    jobType: string,
    description: string,
    requirements: string,
    jobStatus: string
    postedDate: string
}

export type WorkPlace = {
    type: string,
    description: string
}

export type JobApplication = {
    resume: { name: string, file: { fileUri: string, mimeType: string, size: number } | null },
    additionalDocument: { name: string, file: { fileUri: string, mimeType: string, size: number } | null },
    country: string,
    city: string,
    postalCode: string,
    gender: string,
    nationality: string,
    employerContact: string,
    position: string,
    jobId: string,
    employerEmail: string
}

export type Referral = {
    referrerEmail: string,
    fileName: string,
    createdAt: string,
    referrerName: string,
    resume: string
}

export type Resume = {
    uri: string,
    type: string,
    name: string
}
export type WorkExperience = {
    email: string,
    company: string,
    description: string,
    startDate: string,
    endDate: string,
    location: string,
    title: string,
}

export type Education = {
    email: string,
    school: string,
    degree: string,
    major: string,
    description: string,
    startDate: string,
    endDate: string,
}

export type Feedback = {
    applicantEmail: string,
    jobId: string,
    feedback: string,
    feedbackDate: string,
    status: string
}
