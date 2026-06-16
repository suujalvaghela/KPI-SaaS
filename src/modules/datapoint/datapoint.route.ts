import { Router } from "express"
import { createDatapoint, getDatapointsByMetric, deleteDatapoint } from "./datapoint.controller.js"
import { authenticationMiddlewear } from "../../middlewares/authentication.js"
import { validate } from "../../middlewares/validation.js"
import { createDatapointSchema } from "./datapoint.validation.js"

const router = Router()

router.use(authenticationMiddlewear)

router.route('/workspace/:workspaceId/metric/:metricId')
    .post(
        validate(createDatapointSchema),
        createDatapoint
    )
    .get(getDatapointsByMetric)

router.route('/workspace/:workspaceId/:datapointId')
    .delete(deleteDatapoint)

export { router as datapointRoute }
