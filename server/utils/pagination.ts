
export const useMakePagination = (itemsPerPage: number = 16, query: query) => {

    const page = query.page ? parseInt(query.page) : 1

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage - 1;

    return { items: itemsPerPage, page, start, end }
    
}

