import { Request, Response } from "express";
import { successResponse } from "../../utils/response.js";
import { createMemberService, getAllMembersByWorkspaceService, updateMemberService, } from "./membership.service.js";
import { deleteMemberDto, getAllWorkspacesByMemberDto, getMyWorkspacesDto } from "./membership.dao.js";
import { workspaceCreator } from "./membership.authorization.js";

export const createMember = async (req: Request, res: Response) => {
    const { body: { user } } = req;
    const { id: authUser } = req.user!;

    const workspace = req.params.workspaceId as string

    if (user) {
        await workspaceCreator({ authUser, workspace })
        await createMemberService({ mUser: user, workspace })
        return successResponse(res, 201, 'Member created successfully');
    }

    await createMemberService({ mUser: authUser, workspace })
    return successResponse(res, 201, 'Member created successfully');
}

export const getAllMembersByWorkspace = async (req: Request, res: Response) => {
    const authUer = req.user!;
    const workspace = req.params.workspaceId as string
    const members = await getAllMembersByWorkspaceService({ user: authUer.id, workspace })
    return successResponse(res, 200, "Members fetched successfully!", members)
}

export const getAllWorkspacesByMember = async (req: Request, res: Response) => {
    const authUser = req.user!
    const user = req.params.userId as string;
    const workspaces = await getAllWorkspacesByMemberDto({ authUser: authUser.id, user })
    return successResponse(res, 200, "workspaces fetched successfully!", workspaces)
}

export const getMyWorkspaces = async (req: Request, res: Response) => {
    const authUser = req.user!
    const workspaces = await getMyWorkspacesDto(authUser.id)
    return successResponse(res, 200, "workspaces fetched successfully!", workspaces);
}

export const updateMember = async (req: Request, res: Response) => {
    const workspace = req.params.workspaceId as string
    const user = req.params.memberId as string
    const authUser = req.user!
    const { body: { role } } = req;

    await workspaceCreator({ authUser: authUser.id, workspace })
    await updateMemberService({ user, workspace, role })
    return successResponse(res, 200, 'member updated Successfully!')
}

export const deleteMember = async (req: Request, res: Response) => {
    const workspace = req.params.workspaceId as string
    const user = req.params.memberId as string
    const authUser = req.user!

    if (authUser.id === user) {
        await deleteMemberDto({ user, workspace })
        return successResponse(res, 200, 'member deleted Successfully!')
    }

    await workspaceCreator({ authUser: authUser.id, workspace })
    await deleteMemberDto({ user, workspace })
    return successResponse(res, 200, 'member deleted Successfully!')
}