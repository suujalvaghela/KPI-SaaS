import { AuthenticatedUser } from "../../utils/authUser.js"

export interface iWorkspace {
    name: string,
    author: string
}

export interface iUpdateWorkspace {
    workspace: string,
    name: string
}