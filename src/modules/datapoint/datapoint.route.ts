import { Router } from "express"
import { createDatapoint, getDatapointsByMetric, deleteDatapoint } from "./datapoint.controller.js"
import { authenticationMiddlewear } from "../../middlewares/authentication.js"
import { validate } from "../../middlewares/validation.js"
import { createDatapointParams, createDatapointSchema, datapointQuery, deleteDatapointParams, getDatapointParams } from "./datapoint.validation.js"

const router = Router()

router.use(authenticationMiddlewear)

router.route('/workspace/:workspaceId/metric/:metricId')
    .post(validate(createDatapointParams, 'params'), validate(createDatapointSchema, 'body'), createDatapoint)

router.route('/metric/:metricId')
    .get(validate(getDatapointParams, 'params'), validate(datapointQuery, 'query'), getDatapointsByMetric);

router.route('/workspace/:workspaceId/:datapointId')
    .delete(validate(deleteDatapointParams, 'params'), deleteDatapoint);

export { router as datapointRoute }
