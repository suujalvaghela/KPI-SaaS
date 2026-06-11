import { Router } from "express";
import { createWorkspace } from "./workspace.controller.js";
import { authenticationMiddlewear } from "../../middlewares/authentication.js";

const router = Router()

router.use(authenticationMiddlewear)

router.route('/')
    .post(createWorkspace)
    // .get()

// router.route('/:id')
    // .get()
    // .patch()
    // .delete()

export { router as workspaceRoute }