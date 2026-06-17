export interface iCreateNotification {
    user: string,
    workspace: string,
    message: string
}

export interface iUpdateNotification {
    authUser: string
    notification: string
    isRead: boolean
}

export interface iGetNotification {
    authUser: string,
    cursor?: string,
    limit: number
}
