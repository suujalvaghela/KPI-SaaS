import { Router } from "express";
import { deleteUser, getAllUsers, getUserById, updateUser } from "./user.controller.js";
import { authenticationMiddlewear } from "../../middlewares/authentication.js";
import { validate } from "../../middlewares/validation.js";
import { updateUserSchema, userParams, userQuery } from "./user.validate.js";
const router = Router();
router.use(authenticationMiddlewear);
router.route('/').get(validate(userQuery, "query"), getAllUsers);
router.route('/:id')
    .patch(validate(userParams, 'params'), validate(updateUserSchema, 'body'), updateUser)
    .get(validate(userParams, 'params'), getUserById)
    .delete(validate(userParams, 'params'), deleteUser);
export const userRoute = router;
