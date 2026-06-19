import { Router } from "express"
import { createThreshold, getThresholdsByMetric, updateThreshold, deleteThreshold } from "./threshold.controller.js"
import { authenticationMiddlewear } from "../../middlewares/authentication.js"
import { validate } from "../../middlewares/validation.js"
import { createThresholdParams, createThresholdSchema, getThresholdParams, updateThresholdParams, deleteThresholdParams, thresholdQuery, updateThresholdSchema } from "./threshold.validate.js"

const router = Router()

router.use(authenticationMiddlewear)

router.route('/workspace/:workspaceId/metric/:metricId')
    .post(validate(createThresholdParams, 'params'), validate(createThresholdSchema, 'body'), createThreshold);

router.route('/metric/:metricId')
    .get(validate(getThresholdParams, 'params'), validate(thresholdQuery, 'query'), getThresholdsByMetric)

router.route('/workspace/:workspaceId/:thresholdId')
    .patch(validate(updateThresholdParams, 'params'), validate(updateThresholdSchema, 'query'), updateThreshold)
    .delete(validate(deleteThresholdParams, 'params'), deleteThreshold);

export { router as thresholdRoute }
