export const cursorPagination = (list, limit) => {
    const hasMore = list.length > limit;
    const data = hasMore ? list.slice(0, limit) : list;
    const nextCursor = hasMore ? data[data.length - 1].id : null;
    return { list: list.length, data, nextCursor, hasMore };
};
