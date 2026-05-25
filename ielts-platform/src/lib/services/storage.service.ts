/**
 * Storage Service - File upload/download to Supabase Storage
 */

import { BaseService, ServiceResult, success, failure } from './base.service';
import { STORAGE_BUCKETS, type StorageBucket } from '@/lib/supabase/config';

export interface UploadResult {
  url: string;
  path: string;
  bucket: string;
  fileName: string;
  fileSize: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

class StorageService extends BaseService {
  /**
   * Upload a file to Supabase Storage
   */
  async uploadFile(
    bucket: StorageBucket,
    file: File,
    path?: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<ServiceResult<UploadResult>> {
    if (this.isDemo) {
      // Simulate upload in demo mode
      await new Promise(r => setTimeout(r, 1000));
      if (onProgress) {
        onProgress({ loaded: file.size, total: file.size, percentage: 100 });
      }
      const fakeUrl = URL.createObjectURL(file);
      return success({
        url: fakeUrl,
        path: `demo/${file.name}`,
        bucket,
        fileName: file.name,
        fileSize: file.size,
      });
    }

    const client = this.requireSupabase();
    const filePath = path || `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;

    const { data, error } = await client.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) return failure(error.message);

    // Get public URL
    const { data: urlData } = client.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return success({
      url: urlData.publicUrl,
      path: data.path,
      bucket,
      fileName: file.name,
      fileSize: file.size,
    });
  }


  /**
   * Upload audio blob (for speaking recordings)
   */
  async uploadAudioBlob(
    blob: Blob,
    attemptId: string,
    questionId: string,
    userId: string
  ): Promise<ServiceResult<UploadResult>> {
    if (this.isDemo) {
      await new Promise(r => setTimeout(r, 500));
      const fakeUrl = URL.createObjectURL(blob);
      return success({
        url: fakeUrl,
        path: `demo/${attemptId}/${questionId}.webm`,
        bucket: STORAGE_BUCKETS.SPEAKING_RECORDINGS,
        fileName: `${questionId}.webm`,
        fileSize: blob.size,
      });
    }

    const client = this.requireSupabase();
    const filePath = `${userId}/${attemptId}/${questionId}-${Date.now()}.webm`;

    const { data, error } = await client.storage
      .from(STORAGE_BUCKETS.SPEAKING_RECORDINGS)
      .upload(filePath, blob, {
        contentType: 'audio/webm',
        cacheControl: '3600',
      });

    if (error) return failure(error.message);

    const { data: urlData } = client.storage
      .from(STORAGE_BUCKETS.SPEAKING_RECORDINGS)
      .getPublicUrl(data.path);

    return success({
      url: urlData.publicUrl,
      path: data.path,
      bucket: STORAGE_BUCKETS.SPEAKING_RECORDINGS,
      fileName: `${questionId}.webm`,
      fileSize: blob.size,
    });
  }

  /**
   * Delete a file from storage
   */
  async deleteFile(bucket: StorageBucket, path: string): Promise<ServiceResult<void>> {
    if (this.isDemo) return success(undefined);
    const client = this.requireSupabase();
    const { error } = await client.storage.from(bucket).remove([path]);
    if (error) return failure(error.message);
    return success(undefined);
  }

  /**
   * Get a signed URL (for private buckets)
   */
  async getSignedUrl(bucket: StorageBucket, path: string, expiresIn = 3600): Promise<ServiceResult<string>> {
    if (this.isDemo) return success(`/demo-file/${path}`);
    const client = this.requireSupabase();
    const { data, error } = await client.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);
    if (error) return failure(error.message);
    return success(data.signedUrl);
  }

  /**
   * List files in a bucket path
   */
  async listFiles(bucket: StorageBucket, path?: string): Promise<ServiceResult<{ name: string; size: number }[]>> {
    if (this.isDemo) return success([]);
    const client = this.requireSupabase();
    const { data, error } = await client.storage.from(bucket).list(path);
    if (error) return failure(error.message);
    return success((data || []).map(f => ({ name: f.name, size: f.metadata?.size || 0 })));
  }
}

export const storageService = new StorageService();
