import { Router } from "express";
import { deleteUser, getAllUsers, getUserById, updateUser } from "./user.controller.js";
import { authenticationMiddlewear } from "../../middlewares/authentication.js";

const router = Router()

router.use(authenticationMiddlewear)

router.route('/').get(getAllUsers)

router.route('/:id')
    .patch(updateUser)
    .get(getUserById)
    .delete(deleteUser)

export const userRoute = router;