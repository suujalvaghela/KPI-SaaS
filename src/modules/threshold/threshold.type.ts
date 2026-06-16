import { threshold_condition } from "../../generated/prisma/enums.js"

export interface iCreateThreshold {
    metric: string,
    condition: threshold_condition,
    workspace: string,
    value: number,
    notifyUser: string,
    createdBy: string
}

export interface iGetThresholds {
    metric: string,
    user: string
}

export interface iUpdateThreshold {
    threshold: string,
    condition?: threshold_condition,
    value?: number,
    notifyUser?: string
}
