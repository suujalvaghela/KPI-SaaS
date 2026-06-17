export const cursorPagination = <T extends { id: string }>(
    list: T[],
    limit: number
) => {
    const hasMore = list.length > limit;
    const data = hasMore ? list.slice(0, limit) : list;
    const nextCursor = hasMore ? data[data.length - 1].id : null

    return { list: list.length, data, nextCursor, hasMore }
}