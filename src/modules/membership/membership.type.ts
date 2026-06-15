import { workspace_role } from "../../generated/prisma/enums.js"

export interface iGetMember {
    user: string,
    workspace: string
}
export interface iDeleteMember {
    user: string,
    workspace: string
}
export interface iUpdateMember {
    user: string,
    workspace: string,
    role?: workspace_role
}

export interface iCreateMember {
    mUser: string,
    workspace: string
    role?: workspace_role
}

export interface iMemberCreator {
    authUser: string,
    workspace: string
}

export interface iWorkspacesMember {
    authUser: string,
    user: string
}