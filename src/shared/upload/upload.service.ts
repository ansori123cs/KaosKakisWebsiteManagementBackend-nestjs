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
  ): Promise<{
    id: string;
    filename: string;
    url: string;
    thumbUrl: string;
  }> {
    const ext = file.originalname.split('.').pop()?.toLowerCase() || 'jpg';
    if (!['jpg', 'jpeg', 'png'].includes(ext)) {
      throw new BadRequestException('Hanya jpg, jpeg, png yang diperbolehkan');
    }

    const pb = this.pbService.getAuthenticatedClient(token);

    // ── Pakai formdata-node ───────────────────────────────────────
    const form = new FormData();

    const blob = new Blob([file.buffer], { type: file.mimetype });
    form.append('file', blob, file.originalname);

    // Upload
    const record = await pb.collection('kaos_kaki_images').create(form);

    const { url, thumbUrl } = this.pbService.getFileUrl(record, '400x400');

    return {
      id: record.id,
      filename: record.file,
      url,
      thumbUrl,
    };
  }

  //upload multiple file
  async uploadMultiple(files: Express.Multer.File[], token: string) {
    if (!files?.length) return [];

    const uploadPromises = files.map(async (file, index) => {
      try {
        const result = await this.saveImageFile(file, token);
        return { ...result, originalIndex: index };
      } catch (err) {
        console.error(`Upload gagal untuk file ${index}:`, err);
        return {
          error: true,
          message: err.message,
          originalIndex: index,
          filename: file.filename,
          url: '',
          thumbUrl: '',
        };
      }
    });

    const results = await Promise.all(uploadPromises);

    results.sort((a, b) => a.originalIndex - b.originalIndex);

    const successful = results.filter((r) => !r.error);

    return successful;
  }
}
