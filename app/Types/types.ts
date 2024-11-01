import {StackNavigationProp} from "@react-navigation/stack";

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

export type RootStackParamList = {
    HomePanel: undefined,
    Signup: undefined,
    Login:  undefined,
    CreateAccount: undefined,
    LoginPanel: undefined,
    ForgotPassword: undefined,
    ResetPassword: undefined,
    CareerHub: undefined,
    UploadedJobs : undefined,
    CareerInterests: undefined
    }
