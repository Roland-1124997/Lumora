
import { parentPort, workerData } from 'worker_threads';
import sharp from 'sharp';

async function process() {
    const { file } = workerData;

    let buffer;
    if (Buffer.isBuffer(file)) buffer = file;
    else if (typeof file === 'string') buffer = Buffer.from(file, 'utf-8');
    else if (file instanceof Uint8Array || Array.isArray(file)) buffer = Buffer.from(file);
    else throw new Error('Unsupported file type');

    const processed = await sharp(buffer).rotate() .webp({ quality: 10 }) .toBuffer();
    parentPort?.postMessage(processed);
}

process().catch((error) => {
    parentPort?.postMessage({ error: error.message });
});
