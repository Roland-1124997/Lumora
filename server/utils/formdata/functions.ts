
export const useReadMultipartFormData = async (event: H3Event): Promise<{ [key: string]: any; files: FormDataItem[] }> => {
    const request: FormDataItem[] = (await readMultipartFormData(event) || []).filter((item: MultiPartData) => item.name !== undefined) as FormDataItem[];

    const readableData = request.map((item: FormDataItem) => {
        if (item.name.includes('json') && Buffer.isBuffer(item.data)) {
            try {
                const jsonString = item.data.toString('utf8');
                item.data = JSON.parse(jsonString);
            } catch (error) {
                console.error('Invalid JSON:', item.data);
                item.data = [];
            }
        } else if (!item.name.includes('file') && Buffer.isBuffer(item.data)) {
            return { ...item, data: item.data.toString('utf8') };
        }
        return item;
    });

    const result = readableData.reduce((acc: { [key: string]: any }, curr: FormDataItem) => {
        if (!curr.name.includes('file')) acc[curr.name] = curr.data;
        return acc;
    }, {});

    return {
        ...result, files: request.filter((item: FormDataItem) => item.name.includes('file'))
    }
};