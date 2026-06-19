import { Router } from "express"
import { createMetric, getMetricsByWorkspace, updateMetric, deleteMetric, getMetricById } from "./metric.controller.js"
import { authenticationMiddlewear } from "../../middlewares/authentication.js"
import { validate } from "../../middlewares/validation.js"
import { createMetricSchema, getMetricByWorkspaceParams, getMetricParams, metricQuery, updateMetricSchema } from "./metric.validate.js"
import { createMemberParams, deleteMemberParams, updateMemberParams } from "../membership/membership.validate.js"

const router = Router()

router.use(authenticationMiddlewear)

router.route('/workspace/:workspaceId')
    .post(validate(createMemberParams, 'params'), validate(createMetricSchema, 'body'), createMetric)
    .get(validate(getMetricByWorkspaceParams, 'params'), validate(metricQuery, 'query'), getMetricsByWorkspace);

router.route('/workspace/:workspaceId/:metricId')
    .get(validate(getMetricParams, 'params'), getMetricById)
    .patch(validate(updateMemberParams, 'params'), validate(updateMetricSchema, 'body'), updateMetric)
    .delete(validate(deleteMemberParams, 'params'), deleteMetric);

export { router as metricRoute }
