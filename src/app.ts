import express from "express";
import cookieParser from 'cookie-parser'
import authRoute from './modules/auth/auth.route.js'
import userRoute from './modules/user/user.route.js'
import { workspaceRoute } from './modules/workspace/workspace.route.js'
import { Request, Response, NextFunction } from "express";
import { errorResponse } from "./utils/response.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/workspace', workspaceRoute);

app.use((error: Error & { statusCode?: number }, req: Request, res: Response, next: NextFunction) => {
    return errorResponse(res, error.statusCode ?? 500, error)
})

export default app;