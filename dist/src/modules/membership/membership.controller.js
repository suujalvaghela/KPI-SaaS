import { successResponse } from "../../utils/response.js";
import { createMemberService } from "./membership.service.js";
import { workspaceCreator } from "./membership.authorization.js";
export const createMember = async (req, res) => {
    const { body: { user } } = req;
    const { id: authUser } = req.user;
    const workspace = req.params.id;
    if (user) {
        await workspaceCreator({ authUser, workspace });
        await createMemberService({ mUser: user, workspace });
        return successResponse(res, 201, 'Member created successfully');
    }
    await createMemberService({ mUser: authUser, workspace });
    return successResponse(res, 201, 'Member created successfully');
};
export const getMemberById = async (req, res) => { };
export const getAllMembers = async (req, res) => { };
export const updateMember = async (req, res) => { };
export const deleteMember = async (req, res) => { };
