import { APPLICANTS_STATUS_CONFIG } from "@/lib/helpers/constants"

export type Experience = {
    id: string
    company: string
    role: string
    duration: string
    description: string
}

export type FormData = {
    firstName: string
    lastName: string
    email: string
    phone: string
    role: string
    customRole: string
    experienceLevel: string
    availability: string
    rateMin: string
    rateMax: string
    bio: string
    skills: string[]
    experiences: Experience[]
    resumeFile: File | null
    certificateFiles: File[]
    portfolioUrl: string
    githubUrl: string
    linkedinUrl: string
    country: string
    city: string
    status: keyof typeof APPLICANTS_STATUS_CONFIG
    notes: AdminNote[];
}

export type AdminNote = {
  id: string;
  text: string;
  date: string;
};