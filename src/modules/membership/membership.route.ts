import { Router } from "express";
import { createMember, getAllMembersByWorkspace, updateMember, deleteMember, getAllWorkspacesByMember } from "./membership.controller.js";
import { authenticationMiddlewear } from "../../middlewares/authentication.js";

const router = Router()

router.use(authenticationMiddlewear)

router.route('/workspace/:workspaceId')
    .post(createMember)
    .get(getAllMembersByWorkspace);

router.route('/user/:userId')
    .get(getAllWorkspacesByMember)

router.route('/workspace/:workspaceId/:memberId')
    .patch(updateMember)
    .delete(deleteMember)


export const memberRoute = router;