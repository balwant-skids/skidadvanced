/**
 * Cloudflare R2 Storage Service
 * S3-compatible client for file uploads, downloads, and signed URLs
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// R2 Configuration
const R2_ENDPOINT = process.env.CLOUDFLARE_R2_ENDPOINT!;
const R2_BUCKET = process.env.CLOUDFLARE_R2_BUCKET!;
const R2_ACCESS_KEY = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!;
const R2_SECRET_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!;

// Initialize S3 client for R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY,
    secretAccessKey: R2_SECRET_KEY,
  },
});

export interface UploadResult {
  key: string;
  url: string;
  size: number;
  contentType: string;
}

export interface FileMetadata {
  key: string;
  size: number;
  lastModified: Date;
  contentType?: string;
}

/**
 * Upload a file to R2 storage
 */
export async function uploadFile(
  file: Buffer | Uint8Array,
  key: string,
  contentType: string,
  metadata?: Record<string, string>
): Promise<UploadResult> {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: file,
    ContentType: contentType,
    Metadata: metadata,
  });

  await s3Client.send(command);

  return {
    key,
    url: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`,
    size: file.length,
    contentType,
  };
}


/**
 * Generate a signed URL for secure file download
 * @param key - The file key in R2
 * @param expiresIn - URL expiration in seconds (default: 1 hour)
 */
export async function getSignedDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Generate a signed URL for direct file upload
 * @param key - The file key in R2
 * @param contentType - MIME type of the file
 * @param expiresIn - URL expiration in seconds (default: 15 minutes)
 */
export async function getSignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 900
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Delete a file from R2 storage
 */
export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
  });

  await s3Client.send(command);
}

/**
 * List files in a directory/prefix
 */
export async function listFiles(
  prefix: string,
  maxKeys: number = 100
): Promise<FileMetadata[]> {
  const command = new ListObjectsV2Command({
    Bucket: R2_BUCKET,
    Prefix: prefix,
    MaxKeys: maxKeys,
  });

  const response = await s3Client.send(command);

  return (response.Contents || []).map((item) => ({
    key: item.Key!,
    size: item.Size || 0,
    lastModified: item.LastModified || new Date(),
  }));
}

/**
 * Check if a file exists
 */
export async function fileExists(key: string): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
    });
    await s3Client.send(command);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get file metadata
 */
export async function getFileMetadata(key: string): Promise<FileMetadata | null> {
  try {
    const command = new HeadObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
    });
    const response = await s3Client.send(command);
    return {
      key,
      size: response.ContentLength || 0,
      lastModified: response.LastModified || new Date(),
      contentType: response.ContentType,
    };
  } catch {
    return null;
  }
}

// Helper functions for common file operations

/**
 * Generate a unique file key for reports
 */
export function generateReportKey(
  clinicId: string,
  childId: string,
  filename: string
): string {
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `reports/${clinicId}/${childId}/${timestamp}-${sanitizedFilename}`;
}

/**
 * Generate a unique file key for campaign media
 */
export function generateCampaignMediaKey(
  clinicId: string,
  campaignId: string,
  filename: string
): string {
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `campaigns/${clinicId}/${campaignId}/${timestamp}-${sanitizedFilename}`;
}

/**
 * Generate a unique file key for profile images
 */
export function generateProfileImageKey(
  userId: string,
  filename: string
): string {
  const timestamp = Date.now();
  const ext = filename.split('.').pop() || 'jpg';
  return `profiles/${userId}/${timestamp}.${ext}`;
}

/**
 * Get content type from filename
 */
export function getContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    mp4: 'video/mp4',
    webm: 'video/webm',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
  };
  return mimeTypes[ext || ''] || 'application/octet-stream';
}
