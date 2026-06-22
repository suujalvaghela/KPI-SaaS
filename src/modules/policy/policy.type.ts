
export interface iCreatePolicy {
    role: string,
    resource: string,
    action: string
}

export interface iGetAllPolicies {
    cursor?: string,
    limit: number
}