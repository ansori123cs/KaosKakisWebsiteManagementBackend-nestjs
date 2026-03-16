// // supabase.service.ts
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { join } from 'path';
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

//helper
@Injectable()
export class UploadService {
  async saveImageFile(file: Express.Multer.File): Promise<string> {
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'kaos-kaki');
    await fs.mkdir(uploadDir, { recursive: true });

    const ext = file.originalname.split('.').pop()?.toLowerCase() || 'jpg';
    if (!['jpg', 'jpeg', 'png'].includes(ext)) {
      throw new BadRequestException('Hanya jpg, jpeg, png yang diperbolehkan');
    }

    const filename = `${uuidv4()}.${ext}`;
    const filepath = join(uploadDir, filename);

    await fs.writeFile(filepath, file.buffer);

    // URL yang akan disimpan (sesuaikan dengan base URL app Anda)
    return `/files/images/${filename}`;
    // atau jika pakai domain: `https://cdn.domain.com/uploads/kaos-kaki/${filename}`
  }
  //==============================================================================================================
}
