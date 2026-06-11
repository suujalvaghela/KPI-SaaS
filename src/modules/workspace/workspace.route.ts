import { Router } from "express";
import { createWorkspace, deleteWorkspace, getAllWorkspace, getWorkspaceByid, updateWorkspace } from "./workspace.controller.js";
import { authenticationMiddlewear } from "../../middlewares/authentication.js";
import { authorizationMiddlewear } from "../../middlewares/authorization.js";

const router = Router()

router.use(authenticationMiddlewear)

router.route('/')
    .post(
        authorizationMiddlewear("workspaces", "create"),
        createWorkspace
    )
    .get(getAllWorkspace)

router.route('/:id')
    .get(getWorkspaceByid)
    .patch(
        authorizationMiddlewear("workspaces", "update"),
        updateWorkspace
    )
    .delete(
        authorizationMiddlewear("workspaces", "delete"),
        deleteWorkspace
    )

export { router as workspaceRoute }