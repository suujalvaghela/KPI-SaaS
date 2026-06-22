import { Router } from "express";
import { createMember, getAllMembersByWorkspace, updateMember, deleteMember, getAllWorkspacesByMember } from "./membership.controller.js";
import { authenticationMiddlewear } from "../../middlewares/authentication.js";
import { validate } from "../../middlewares/validation.js";
import { createMemberParams, deleteMemberParams, getAllMembersByWorkspaceParams, getAlWorkspacesByMemberParams, memberQuery, memberSchema, updateMemberParams } from "./membership.validate.js";
const router = Router();
router.use(authenticationMiddlewear);
router.route('/workspace/:workspaceId')
    .post(validate(createMemberParams, 'params'), validate(memberSchema, 'body'), createMember)
    .get(validate(getAllMembersByWorkspaceParams, 'params'), validate(memberQuery, 'query'), getAllMembersByWorkspace);
router.route('/user/:userId').get(validate(getAlWorkspacesByMemberParams, 'params'), validate(memberQuery, 'query'), getAllWorkspacesByMember);
router.route('/workspace/:workspaceId/:memberId')
    .patch(validate(updateMemberParams, 'params'), validate(memberSchema, 'body'), updateMember)
    .delete(validate(deleteMemberParams, 'params'), deleteMember);
export const memberRoute = router;
