import { workspace_plan } from "../../generated/prisma/enums.js"

export interface iWorkspace {
    name: string,
    author: string
}

export interface iUpdateWorkspace {
    workspace: string,
    name?: string,
    plan?: workspace_plan
}

export interface iWorkspacesMember {
    authUser: string,
    user: string,
    cursor?: string,
    limit: number
}

export interface iGetMyWorkspaces {
    authUser: string,
    cursor?: string,
    limit: number
}