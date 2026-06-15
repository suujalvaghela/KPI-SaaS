import { Router } from "express";
import { createMember, getAllMembers, getMemberById, updateMember, deleteMember } from "./membership.controller.js";
import { authenticationMiddlewear } from "../../middlewares/authentication.js";
const router = Router();
router.use(authenticationMiddlewear);
router.route('/').get(getAllMembers);
router.route('/workspace/:workspaceId/:memberId').patch(updateMember);
router.route('/:id')
    .post(createMember)
    .get(getMemberById)
    .delete(deleteMember);
export const memberRoute = router;
