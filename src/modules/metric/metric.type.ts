export interface iCreateMetric {
    workspace: string,
    name: string,
    description: string,
    unit: string,
    creator: string
}

export interface iGetMetric {
    user: string,
    workspace: string,
    cursor?: string,
    limit: number
}

export interface iDeleteMetric {
    authUser: string,
    metric: string
}

export interface iUpdateMetric {
    metric: string,
    name?: string,
    description?: string,
    unit?: string
}
