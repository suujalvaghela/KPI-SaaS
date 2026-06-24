import { Request, Response } from "express"
import { AppError, successResponse } from "../../utils/response.js";
import { getAllUsersDao, getUserByIdDao } from "./user.dao.js";
import { clearRefreshTokenCookie } from "../../utils/tokens.js";
import { updateUserService, deleteUserService } from "./user.service.js";

export const getAllUsers = async (req: Request, res: Response) => {
    const limit = req.query.limit ? Number(req.query.limit) : 5
    const cursor = req.query.cursor as string | undefined
    const users = await getAllUsersDao({ limit, cursor });
    return successResponse(res, 200, 'Users retrieved successfully', users);
}

export const updateUser = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { name, role }  = req.body;
    const authUser = req.user!;

    await updateUserService(authUser, { id, name, role });
    return successResponse(res, 200, 'User updated successfully');
}

export const getUserById = async (req: Request, res: Response) => {
    const { params: { id } } = req;

    if (!id || typeof id !== 'string') {
        const error = new Error('Invalid user ID') as AppError;
        error.statusCode = 400;
        throw error;
    }

    const user = await getUserByIdDao(id);

    if (!user) {
        const error = new Error('User not found') as AppError;
        error.statusCode = 404;
        throw error;
    }

    return successResponse(res, 200, 'User retrieved successfully', user);
}

export const deleteUser = async (req: Request, res: Response) => {
    const { params: { id } } = req;
    const authUser = req.user!;

    if (!id || typeof id !== 'string') {
        const error = new Error('Invalid user ID') as AppError;
        error.statusCode = 400;
        throw error;
    }

    await deleteUserService({ authUser, id });
    await clearRefreshTokenCookie(res);

    return successResponse(res, 200, 'User deleted successfully');
}