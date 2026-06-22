import { Router } from "express";
import { createWorkspace, deleteWorkspace, getMyWorkspaces, getWorkspaceByid, updateWorkspace } from "./workspace.controller.js";
import { authenticationMiddlewear } from "../../middlewares/authentication.js";
import { authorizationMiddlewear } from "../../middlewares/authorization.js";
import { validate } from "../../middlewares/validation.js";
import { createWorkspaceSchema, updateWorkspaceSchema, workspaceQuery, workspaceParams } from "./workspace.validate.js";
const router = Router();
router.use(authenticationMiddlewear);
router.route('/').post(validate(createWorkspaceSchema), authorizationMiddlewear("workspaces", "create"), createWorkspace);
router.route('/me').get(validate(workspaceQuery, 'query'), getMyWorkspaces);
router.route('/:id')
    .get(validate(workspaceParams, 'params'), getWorkspaceByid)
    .patch(validate(workspaceParams, 'params'), validate(updateWorkspaceSchema), authorizationMiddlewear("workspaces", "update"), updateWorkspace)
    .delete(validate(workspaceParams, 'params'), authorizationMiddlewear("workspaces", "delete"), deleteWorkspace);
export { router as workspaceRoute };
