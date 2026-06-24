import { AuthenticatedUser } from '../../utils/authUser.js';

export interface iUpdateUser {
    id: string,
    name?: string;
    role?: string;
}

export interface iDeleteUser {
    authUser: AuthenticatedUser;
    id: string;
}

export interface iGetAllUsers {
    cursor?: string
    limit: number
}