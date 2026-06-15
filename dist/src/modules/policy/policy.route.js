import { Router } from 'express';
import { createPolicy } from './policy.js';
import { authenticationMiddlewear } from '../../middlewares/authentication.js';
const router = Router();
router.route('/').post(authenticationMiddlewear, 
// authorizationMiddlewear("policies", "create"),
createPolicy);
export const policyRoute = router;
