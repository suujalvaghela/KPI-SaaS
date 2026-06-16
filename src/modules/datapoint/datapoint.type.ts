export interface iCreateDatapoint {
    authUser: string,
    metric: string,
    value: number,
    timestamp: string | Date,
}

export interface iDeleteDatapoint {
    authUser: string,
    datapoint: string
}

export interface iGetDatapoints {
    metric: string,
    user: string
}
