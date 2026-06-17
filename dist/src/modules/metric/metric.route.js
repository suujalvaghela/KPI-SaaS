import { Router } from "express";
import { createMetric, getMetricsByWorkspace, updateMetric, deleteMetric, getMetricsById } from "./metric.controller.js";
import { authenticationMiddlewear } from "../../middlewares/authentication.js";
import { validate } from "../../middlewares/validation.js";
import { createMetricSchema, updateMetricSchema } from "./metric.validation.js";
const router = Router();
router.use(authenticationMiddlewear);
router.route('/workspace/:workspaceId')
    .post(validate(createMetricSchema), createMetric)
    .get(getMetricsByWorkspace);
router.route('/workspace/:workspaceId/:metricId')
    .get(getMetricsById)
    .patch(validate(updateMetricSchema), updateMetric)
    .delete(deleteMetric);
export { router as metricRoute };
