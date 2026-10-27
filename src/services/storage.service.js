/**
 * Storage Service & Client
 * Object storage abstraction wrapping mbkbucket (Local Disk / S3 / Cloudflare R2 / Google Drive).
 */
import {
    downloadFile,
    uploadFile,
    deleteFile,
    deleteFiles,
    deleteFolder,
    getFileMetadata,
    fileExists,
    listfiles,
    createFolder
} from 'mbkbucket';

export class StorageService {
    constructor(defaultBucket = process.env.DEFAULT_BUCKET || 'default') {
        this.defaultBucket = defaultBucket;
    }

    async getMetadata(key, bucketName = this.defaultBucket) {
        return getFileMetadata(key, bucketName);
    }

    async download(key, options = {}) {
        const bucketName = options.bucketName || this.defaultBucket;
        return downloadFile(key, { ...options, bucketName });
    }

    async upload(key, fileBuffer, contentType = 'application/octet-stream', options = {}) {
        const bucketName = options.bucketName || this.defaultBucket;
        return uploadFile(key, fileBuffer, contentType, { ...options, bucketName });
    }

    async delete(key, bucketName = this.defaultBucket) {
        return deleteFile(key, bucketName);
    }

    async deleteMany(keys, bucketName = this.defaultBucket) {
        return deleteFiles(keys, bucketName);
    }

    async list(prefix = '', options = {}) {
        const bucketName = options.bucketName || this.defaultBucket;
        return listfiles(prefix, { ...options, bucketName });
    }

    async exists(key, bucketName = this.defaultBucket) {
        return fileExists(key, bucketName);
    }

    async createDirectory(folderPath, bucketName = this.defaultBucket) {
        return createFolder(folderPath, bucketName);
    }
}

export const storageService = new StorageService();

export {
    downloadFile,
    uploadFile,
    deleteFile,
    deleteFiles,
    deleteFolder,
    getFileMetadata,
    fileExists,
    listfiles,
    createFolder
};

export default storageService;
