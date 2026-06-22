import { Router } from 'express';
import { createPolicy, getAllPolicy, getPolicyById, deletePolicy } from './policy.controller.js';
import { authenticationMiddlewear } from '../../middlewares/authentication.js';
import { authorizationMiddlewear } from '../../middlewares/authorization.js';
const router = Router();
router.use(authenticationMiddlewear);
router.route('/')
    .post(authorizationMiddlewear("policies", "create"), createPolicy)
    .get(authorizationMiddlewear("policies", "read"), getAllPolicy);
router.route('/:id')
    .get(authorizationMiddlewear("policies", "read"), getPolicyById)
    .delete(authorizationMiddlewear("policies", "delete"), deletePolicy);
export const policyRoute = router;
