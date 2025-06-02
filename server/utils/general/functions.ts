import sharp from "sharp";
import os from "os";

interface Storage {
    bucket_id: string,
    total_size_megabyte: string,
    groups: [{
        group_id: string,
        total_size_megabyte: string,
    }]
}

const imageQueue: (() => Promise<void>)[] = [];
let processing = false;
export let TOTAL_MEMORY_MB: number = 520
export let TOTAL_STORAGE: Storage
export let TOTAL_MONTHLY_ACTIVE_USERS: object = []

export const MAX_MEMORY_MB = TOTAL_MEMORY_MB * 0.8;
export const MAX_STORAGE_SIZE = 1024
export const MAX_QUEUE_LENGTH = 20;

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


export const useSupabaseUsage = async () => {

    const supabase = useSupaBaseServer();

    const { data: storage, error: storageError } = await supabase.rpc("get_bucket_sizes")

    const { data: groupStorage, error: GroupStorageError } = await supabase.rpc("get_group_storage_sizes")

    if (!storageError && !GroupStorageError) TOTAL_STORAGE = {
        ...storage[0],
        groups: groupStorage
    }

    const { data: active, error: activeError } = await supabase.rpc("get_monthly_active_users");
    if (!activeError) {

        const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long' })

        TOTAL_MONTHLY_ACTIVE_USERS = active.map((item: { month: string; active_users: number }) => ({
            month: monthFormatter.format(new Date(item.month)),
            users: item.active_users,
        }))
    }
        
}

export const useRenderMemory = async () => {

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
}


export const useGetCpuUsagePercent = () => {
    const cpus = os.cpus();
    let idle = 0, total = 0;
    for (const cpu of cpus) {
        for (const type in cpu.times) {
            total += cpu.times[type as keyof typeof cpu.times];
        }
        idle += cpu.times.idle;
    }
    const idleAvg = idle / cpus.length;
    const totalAvg = total / cpus.length;
    return { idle: idleAvg, total: totalAvg };
}