export const cursorPagination = (list, limit) => {
    const hasMore = list.length > limit;
    const data = hasMore ? list.slice(0, limit) : list;
    const nextCursor = hasMore ? data[data.length - 1].id : null;
    const items = hasMore ? list.length - 1 : list.length;
    return { list: items, data, nextCursor, hasMore };
};
