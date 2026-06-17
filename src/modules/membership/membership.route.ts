import { Router } from "express";
import { createMember, getAllMembersByWorkspace, updateMember, deleteMember, getAllWorkspacesByMember } from "./membership.controller.js";
import { authenticationMiddlewear } from "../../middlewares/authentication.js";
import { validate } from "../../middlewares/validation.js";
import { memberSchema } from "./membership.validate.js";

const router = Router()

router.use(authenticationMiddlewear)

router.route('/workspace/:workspaceId')
    .post(
        validate(memberSchema),
        createMember
    )
    .get(getAllMembersByWorkspace);

router.route('/user/:userId')
    .get(getAllWorkspacesByMember)

router.route('/workspace/:workspaceId/:memberId')
    .patch(
        validate(memberSchema),
        updateMember
    )
    .delete(deleteMember)


export const memberRoute = router;