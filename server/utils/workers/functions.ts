import { Worker } from 'worker_threads'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const runImageWorker = (fileData: FormDataItem): Promise<Buffer> => {
    return new Promise((resolvePromise, reject) => {
        const workerPath = resolve(__dirname, '../../server/workers/main.js')

        const worker = new Worker(workerPath, {
            workerData: { file: fileData.data }
        })

        worker.on('message', (result) => {
            if (result?.error) return reject(new Error(result.error))
            resolvePromise(result)
        })

        worker.on('error', reject)

        worker.on('exit', (code) => {
            if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`))
        })
    })
}
