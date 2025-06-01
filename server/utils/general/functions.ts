import sharp from "sharp";

const imageQueue: (() => Promise<void>)[] = [];
let processing = false;
let TOTAL_MEMORY_MB : number | undefined = 520

const MAX_MEMORY_MB = TOTAL_MEMORY_MB * 0.8; 
const MAX_QUEUE_LENGTH = 20;

const getMemoryUsageMB = () => process.memoryUsage().rss / 1024 / 1024;

const processQueue = async () => {
    if (processing) return;
    processing = true;
    while (imageQueue.length > 0) {
        if (getMemoryUsageMB() > MAX_MEMORY_MB) {
            console.warn("Too much memory used, waiting...");
            await new Promise(res => setTimeout(res, 1000));
            continue;
        }
        const task = imageQueue.shift();
        if (task) await task();
    }
    processing = false;
}

export const queueImageProcess = (file: FormDataItem, onDone: (result: Buffer) => void, onError: (err: Error) => void) => {
    if (imageQueue.length >= MAX_QUEUE_LENGTH) {
        onError(new Error("Server is busy, please try again later."));
        return;
    }
    imageQueue.push(() => {
        return processImage(file)
            .then(onDone)
            .catch((err) => onError(err as Error));
    });
    processQueue();
};

export const processImage = async (file: FormDataItem) => {
    let buffer: Buffer;

    if (Buffer.isBuffer(file.data)) buffer = file.data;
    else if (typeof file.data === "string") buffer = Buffer.from(file.data, "utf-8");
    else if (file.data instanceof Uint8Array || Array.isArray(file.data)) buffer = Buffer.from(file.data);
    else throw new Error("Unsupported data type for file.data");

    return await sharp(buffer).rotate().resize({ width: 800, withoutEnlargement: true }).webp({ quality: 5, lossless: true }).toBuffer();
};

export const uploadImage = async (client: SupabaseClient, groupId: string, userId: string, imageId: string, buffer: Buffer) => {
    return await client.storage.from('images').upload(
        `${groupId}/${userId}/${imageId}.webp`, buffer, {
        contentType: "image/webp",
        cacheControl: '3600',
        upsert: true,
    });
};

export const UseRenderMemory = async () => {

    const { render } = useRuntimeConfig()

    await $fetch(render.uri, {
        query: { resolutionSeconds: 3600, resource: render.resource },
        headers: { authorization: `Bearer ${render.key}` }
    })
    .then((response: any) => {
        const lastItem = response[response.length - 1];
        const lastValue = lastItem?.values?.[lastItem.values.length - 1].value;
        TOTAL_MEMORY_MB = Math.round(lastValue / 1024 / 1024) + 8
    })
    .catch(() => { })

    return TOTAL_MEMORY_MB;
}
