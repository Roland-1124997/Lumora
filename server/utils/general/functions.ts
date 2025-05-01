import sharp from "sharp";

export const processImage = async (file: FormDataItem) => {
    let buffer: Buffer;

    if (Buffer.isBuffer(file.data)) buffer = file.data;
    else if (typeof file.data === "string") buffer = Buffer.from(file.data, "utf-8"); 
    else if (Array.isArray(file.data))  buffer = Buffer.from(file.data); 
    else throw new Error("Unsupported data type for file.data");
    
    return await sharp(buffer).rotate().webp({ quality: 10 }).toBuffer();
};

export const uploadImage = async (client: SupabaseClient, groupId: string, userId: string, imageId: string, buffer: Buffer) => {
    return await client.storage.from('images').upload(
        `${groupId}/${userId}/${imageId}.webp`, buffer, {
        contentType: "image/webp",
        cacheControl: '3600',
        upsert: true,
    });
};