export const COMPANY = {
    name: "Juspher & Co Tech Solutions",
    email: "hello@yourcompany.com",
    address: "Eagle St., T. Padilla, Cebu City, Philippines",
    phone: "+1 (000) 000-0000",
    website: "https://yourcompany.com",
} as const

export const CONTRACT_PLACEHOLDERS = [
    // Company
    { key: "company_name", label: "Company Name", source: "company" },
    { key: "company_email", label: "Company Email", source: "company" },
    { key: "company_address", label: "Company Address", source: "company" },
    { key: "company_phone", label: "Company Phone", source: "company" },
    { key: "company_website", label: "Company Website", source: "company" },

    // Client
    { key: "client_name", label: "Client Name", source: "client" },
    { key: "client_email", label: "Client Email", source: "client" },
    { key: "client_company", label: "Client Company", source: "client" },
    { key: "client_phone", label: "Client Phone", source: "client" },
    { key: "client_address", label: "Client Address", source: "client" },

    // Project
    { key: "project_title", label: "Project Title", source: "project" },
    { key: "project_description", label: "Project Description", source: "project" },
    { key: "project_budget", label: "Project Budget", source: "project" },
    { key: "project_start_date", label: "Start Date", source: "project" },
    { key: "project_due_date", label: "Due Date", source: "project" },
    { key: "project_milestones", label: "Milestones", source: "project" },

    // Contract meta
    { key: "contract_date", label: "Contract Date", source: "meta" },
    { key: "contract_expiry", label: "Contract Expiry", source: "meta" },
    { key: "effective_date", label: "Effective Date", source: "meta" },
] as const

export type PlaceholderKey = typeof CONTRACT_PLACEHOLDERS[number]["key"]