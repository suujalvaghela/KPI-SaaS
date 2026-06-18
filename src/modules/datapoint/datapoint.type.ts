export interface iCreateDatapoint {
    authUser: string,
    metric: string,
    value: number,
    timestamp: string | Date,
    workspace: string
}

export interface iDeleteDatapoint {
    authUser: string,
    datapoint: string,
    workspace: string
}

export interface iGetDatapoints {
    metric: string,
    user: string,
    cursor?: string,
    limit: number
}
