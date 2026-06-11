import { Router } from "express";
import { createWorkspace, getAllWorkspace } from "./workspace.controller.js";
import { authenticationMiddlewear } from "../../middlewares/authentication.js";

const router = Router()

router.use(authenticationMiddlewear)

router.route('/')
    .post(createWorkspace)
    .get(getAllWorkspace)

// router.route('/:id')
// .get()
// .patch()
// .delete()

export { router as workspaceRoute }