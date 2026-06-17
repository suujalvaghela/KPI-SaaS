export interface iWorkspace {
    name: string,
    author: string
}

export interface iUpdateWorkspace {
    workspace: string,
    name: string
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