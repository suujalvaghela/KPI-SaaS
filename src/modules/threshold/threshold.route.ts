import { Router } from "express"
import { createThreshold, getThresholdsByMetric, updateThreshold, deleteThreshold } from "./threshold.controller.js"
import { authenticationMiddlewear } from "../../middlewares/authentication.js"
import { validate } from "../../middlewares/validation.js"
import { createThresholdSchema, updateThresholdSchema } from "./threshold.validation.js"

const router = Router()

router.use(authenticationMiddlewear)

router.route('/workspace/:workspaceId/metric/:metricId')
    .post(
        validate(createThresholdSchema),
        createThreshold
    )
    .get(getThresholdsByMetric)

router.route('/workspace/:workspaceId/:thresholdId')
    .patch(
        validate(updateThresholdSchema),
        updateThreshold
    )
    .delete(deleteThreshold)

export { router as thresholdRoute }
