import { successResponse } from "../../utils/response.js";
import { createMemberService, getAllMembersByWorkspaceService, updateMemberService, } from "./membership.service.js";
import { deleteMemberDto, getAllWorkspacesByMemberDto } from "./membership.dao.js";
import { workspaceCreator } from "./membership.authorization.js";
export const createMember = async (req, res) => {
    const { body: { user } } = req;
    const { id: authUser } = req.user;
    const workspace = req.params.workspaceId;
    if (user) {
        await workspaceCreator({ authUser, workspace });
        await createMemberService({ mUser: user, workspace });
        return successResponse(res, 201, 'Member created successfully');
    }
    await createMemberService({ mUser: authUser, workspace });
    return successResponse(res, 201, 'Member created successfully');
};
export const getAllMembersByWorkspace = async (req, res) => {
    const authUer = req.user;
    const workspace = req.params.workspaceId;
    const cursor = req.query.cursor;
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const members = await getAllMembersByWorkspaceService({ user: authUer.id, workspace, cursor, limit });
    return successResponse(res, 200, "Members fetched successfully!", members);
};
export const getAllWorkspacesByMember = async (req, res) => {
    const authUser = req.user;
    const user = req.params.userId;
    const cursor = req.query.cursor;
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const workspaces = await getAllWorkspacesByMemberDto({ authUser: authUser.id, user, cursor, limit });
    return successResponse(res, 200, "workspaces fetched successfully!", workspaces);
};
export const updateMember = async (req, res) => {
    const workspace = req.params.workspaceId;
    const user = req.params.memberId;
    const authUser = req.user;
    const { body: { role } } = req;
    await workspaceCreator({ authUser: authUser.id, workspace });
    await updateMemberService({ user, workspace, role });
    return successResponse(res, 200, 'member updated Successfully!');
};
export const deleteMember = async (req, res) => {
    const workspace = req.params.workspaceId;
    const user = req.params.memberId;
    const authUser = req.user;
    if (authUser.id === user) {
        await deleteMemberDto({ user, workspace });
        return successResponse(res, 200, 'member deleted Successfully!');
    }
    await workspaceCreator({ authUser: authUser.id, workspace });
    await deleteMemberDto({ user, workspace });
    return successResponse(res, 200, 'member deleted Successfully!');
};
