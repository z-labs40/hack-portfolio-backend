import { supabase } from './supabase';
import { config } from '../config';
import { AppError } from '../shared/error';
import { Logger } from '../shared/logger';
import path from 'path';

export class StorageService {
  private static bucket = config.supabase.bucket;

  /**
   * Uploads a file buffer to Supabase Storage
   * @param buffer File buffer
   * @param originalName Original file name
   * @param mimeType MIME type of the file
   * @returns Public URL of the uploaded file
   */
  public static async uploadFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<{ fileName: string; publicUrl: string }> {
    try {
      const extension = path.extname(originalName);
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${extension}`;
      const filePath = `uploads/${fileName}`;

      const { data, error } = await supabase.storage
        .from(this.bucket)
        .upload(filePath, buffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (error) {
        Logger.error(`❌ Supabase Storage upload error: ${error.message}`);
        throw new AppError(`Failed to upload file to storage: ${error.message}`, 500);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(this.bucket)
        .getPublicUrl(filePath);

      Logger.info(`📁 File uploaded to Supabase: ${fileName}`);

      return {
        fileName,
        publicUrl,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      Logger.error(`❌ Unexpected storage error: ${error}`);
      throw new AppError('An unexpected error occurred during file upload', 500);
    }
  }

  /**
   * Deletes a file from Supabase Storage
   * @param fileName Name of the file to delete
   */
  public static async deleteFile(fileName: string): Promise<void> {
    try {
      const filePath = `uploads/${fileName}`;
      const { error } = await supabase.storage
        .from(this.bucket)
        .remove([filePath]);

      if (error) {
        Logger.error(`❌ Supabase Storage delete error: ${error.message}`);
        throw new AppError(`Failed to delete file from storage: ${error.message}`, 500);
      }

      Logger.info(`🗑️ File deleted from Supabase: ${fileName}`);
    } catch (error) {
      if (error instanceof AppError) throw error;
      Logger.error(`❌ Unexpected storage error: ${error}`);
      throw new AppError('An unexpected error occurred during file deletion', 500);
    }
  }
}
