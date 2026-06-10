import { Router } from "express";
import { getCurrentUser, handleGoogleAuth, logoutUser, rotateTokens } from "./auth.controller.js";

const router = Router();

router.route('/google').post(handleGoogleAuth);
router.route('/refresh').get(rotateTokens);
router.route('/logout').post(logoutUser);
router.route('/me').post(getCurrentUser);

export default router;