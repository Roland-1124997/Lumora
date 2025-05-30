export async function convertToWebp(file: File): Promise<Blob> {
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer]);
    const imageBitmap = await createImageBitmap(blob);

    const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context error");

    ctx.drawImage(imageBitmap, 0, 0);

    const webpBlob = await canvas.convertToBlob({ type: "image/webp", quality: 0.7 });
    return webpBlob;
}