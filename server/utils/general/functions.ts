import webpush from "web-push";
import sharp from "sharp";
import os from "os";

import { createTransport } from 'nodemailer'
import { consola } from 'consola';


interface Storage {
    bucket_id: string,
    total_size_megabyte: string,
    groups: [{
        group_id: string,
        total_size_megabyte: string,
    }]
}

const { build } = useRuntimeConfig()

const imageQueue: (() => Promise<void>)[] = [];
let processing = false;
export let TOTAL_MEMORY_MB: number = 520
export let TOTAL_STORAGE: Storage
export let TOTAL_MONTHLY_ACTIVE_USERS: object = []
export let REQUEST_LOGS: object = []

export const MAX_MEMORY_MB = (build ? TOTAL_MEMORY_MB : Math.round(os.totalmem() / 1024 / 1024)) * 0.8;
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

    return await sharp(buffer).rotate().resize({ width: 800, withoutEnlargement: true }).webp({ quality: 5, lossless: false }).toBuffer();
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

    const { data: monthlyUsers, error: activeError } = await supabase.rpc('get_monthly_active_users')

    if (!activeError) TOTAL_MONTHLY_ACTIVE_USERS = monthlyUsers;
    
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

export const useSendNotification = async (options: { title: string, message: string, target_id: string }) => {
    
    const { vapidPublicKey, vapidPrivateKey } = useRuntimeConfig()

    webpush.setVapidDetails(
        'mailto:example@yourdomain.org',
        vapidPublicKey,
        vapidPrivateKey
    );

    const server = useSupaBaseServer()
    const { data, error }: any = await server.from("push_subscriptions").select("*").eq("user_id", options.target_id).single()

    if(error) return

    const payload = JSON.stringify({
        title: options.title, message: options.message,
        url: '/notifications'
    })

    webpush.sendNotification(data.subscription, payload)
        .then(() => console.log('Notification sent'))
        .catch(err => console.error('Error sending notification:', err));

};


const { smtpSender, smtpToken, smtpUser, smtpServer } = useRuntimeConfig()

const transporter = createTransport({
    service: 'Gmail',
    host: smtpServer,
    port: 587,
    secure: true,
    requireTLS: true,
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2',
    },
    auth: {
        user: smtpUser,
        pass: smtpToken
    },
    debug: true,
    logger: true,
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
});

transporter.verify((error) => {
    if (error) consola.error('Server is not ready to send mail', {
        message: (error as any)?.message,
        code: (error as any)?.code,
        command: (error as any)?.command,
        responseCode: (error as any)?.responseCode,
    });
    else consola.success("Mail server initialized")
});

export const useMailer = async (options: { recepient: string, subject: string, body: any }) => {
    const { recepient, subject, body } = options

    const response: any = {
        success: null,
        error: null
    }

    const mailOptions = {
        from: smtpSender,
        to: recepient,
        subject: subject,
        html: body,
    }

    await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) return reject(error);
            resolve(info);
        });
    })

        .then((info: any) => {
            consola.success('Email sent:', info.messageId, info.response)
            response.success = true
        })

        .catch((error) => {
            consola.error('Email not sent:', {
                code: error?.code,
                command: error?.command,
                responseCode: error?.responseCode,
                response: error?.response,
                message: error?.message,
            })
            response.error = error
        });

    return response

};