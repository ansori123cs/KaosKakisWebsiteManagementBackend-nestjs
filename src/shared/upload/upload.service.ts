import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { PocketBaseService } from '../pocketbase/pocketbase.service';
import { v4 as uuidv4 } from 'uuid';
import { FormData } from 'formdata-node';
import { Blob } from 'formdata-node';

@Injectable()
export class UploadService {
  constructor(
    @Inject(PocketBaseService) private pbService: PocketBaseService,
  ) {}

  async saveImageFile(
    file: Express.Multer.File,
    token: string,
    name?: string,
  ): Promise<{
    id: string;
    filename: string;
    url: string;
    thumbUrl: string;
  }> {
    const ext = file.originalname.split('.').pop()?.toLowerCase() || 'jpg';
    if (!['jpg', 'jpeg', 'png'].includes(ext)) {
      throw new BadRequestException(
        'Hanya file jpg, jpeg, png yang diperbolehkan',
      );
    }

    const pb = this.pbService.getAuthenticatedClient(token);

    const form = new FormData();

    const blob = new Blob([file.buffer], { type: file.mimetype });
    form.append('file', blob, file.originalname);

    try {
      // Upload dan buat record
      const record = await pb.collection('item_images').create(form);

      // Ambil URL + thumbnail
      const { url, thumbUrl } = this.pbService.getFileUrl(record, '400x400');

      return {
        id: record.id,
        filename: record.file as string,
        url,
        thumbUrl,
      };
    } catch (err: any) {
      // Tangani error PocketBase (misal 400, 403, dll)
      if (err?.status === 400 || err?.status === 403) {
        throw new BadRequestException(
          err?.data?.message || 'Gagal upload file ke PocketBase',
        );
      }
      throw err;
    }
  }

  async removeImageFile(
    recordId: string,
    token: string,
  ): Promise<{ success: boolean; message?: string }> {
    const pb = this.pbService.getAuthenticatedClient(token);

    try {
      await pb.collection('item_images').delete(recordId);
      return { success: true };
    } catch (err: any) {
      if (err?.status === 404) {
        return { success: false, message: 'Record tidak ditemukan' };
      }
      if (err?.status === 403) {
        throw new BadRequestException('Tidak berhak menghapus file ini');
      }
      throw err;
    }
  }

  async uploadMultiple(
    files: Express.Multer.File[],
    token: string,
    baseName?: string,
  ): Promise<
    Array<{
      success: boolean;
      id?: string;
      filename?: string;
      url?: string;
      thumbUrl?: string;
      error?: string;
      originalIndex: number;
    }>
  > {
    if (!files?.length) {
      return [];
    }

    const uploadPromises = files.map(async (file, index) => {
      try {
        const result = await this.saveImageFile(
          file,
          token,
          baseName ? `${baseName}-${index + 1}` : undefined,
        );

        return {
          success: true,
          ...result,
          originalIndex: index,
        };
      } catch (err: any) {
        console.error(
          `Upload gagal untuk file index ${index}:`,
          err?.message || err,
        );
        return {
          success: false,
          error: err?.message || 'Upload gagal',
          originalIndex: index,
          filename: file.originalname,
          url: '',
          thumbUrl: '',
        };
      }
    });

    const results = await Promise.all(uploadPromises);

    results.sort((a, b) => a.originalIndex - b.originalIndex);

    return results;
  }
}
