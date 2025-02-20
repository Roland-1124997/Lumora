

export const useMakePagination = (itemsPerPage: number = 16, page: number) => {

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage - 1;

    return { items: itemsPerPage, page, start, end }
    
}

