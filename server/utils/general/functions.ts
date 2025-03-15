import sharp from "sharp";

export const processImage = async (file: FormDataItem) => {
    let buffer = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data);
    return await sharp(buffer).rotate().webp({ quality: 10 }).toBuffer();
}

export const uploadImage = async (client: SupabaseClient, groupId: string, userId: string, imageId: string, buffer: Buffer) => {
    return await client.storage.from('images').upload(
        `${groupId}/${userId}/${imageId}.webp`, buffer, {
        contentType: "image/webp",
        cacheControl: '3600',
        upsert: true,
    });
}

