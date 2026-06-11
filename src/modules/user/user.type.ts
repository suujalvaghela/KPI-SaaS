import { AuthenticatedUser } from '../../utils/authUser.js';

export interface iUpdateUser {
    id: string,
    name?: string;
}

export interface iDeleteUser {
    authUser: AuthenticatedUser;
    id: string;
}