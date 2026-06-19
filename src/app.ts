import express from "express";
import cookieParser from 'cookie-parser'
import { authRoute } from './modules/auth/auth.route.js'
import { userRoute } from './modules/user/user.route.js'
import { policyRoute } from './modules/policy/policy.route.js'
import { workspaceRoute } from './modules/workspace/workspace.route.js'
import { memberRoute } from "./modules/membership/membership.route.js";
import { metricRoute } from "./modules/metric/metric.route.js";
import { datapointRoute } from "./modules/datapoint/datapoint.route.js";
import { thresholdRoute } from "./modules/threshold/threshold.route.js";
import { notificationRoute } from "./modules/notification/notification.route.js";
import { paymentRoute } from './modules/payment/payment.route.js'
import { Request, Response, NextFunction } from "express";
import { errorResponse } from "./utils/response.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/policy', policyRoute);
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/workspace', workspaceRoute);
app.use('/api/member', memberRoute);
app.use('/api/metric', metricRoute);
app.use('/api/datapoint', datapointRoute);
app.use('/api/threshold', thresholdRoute);
app.use('/api/notification', notificationRoute);
app.use('/api/payment', paymentRoute)

app.use((error: Error & { statusCode?: number }, req: Request, res: Response, next: NextFunction) => {
    return errorResponse(res, error.statusCode ?? 500, error)
})

export default app;
