// // supabase.service.ts
// import { Injectable, Inject } from '@nestjs/common';
// import { SupabaseClient } from '@supabase/supabase-js';

// @Injectable()
// export class SupabaseService {
//   constructor(
//     @Inject(SupabaseClient) private readonly supabase: SupabaseClient,
//   ) {}

//   async upload(file: Express.Multer.File) {
//     const fileName = `${Date.now()}-${file.originalname}`;
//     const bucketName = 'images'; // Name of your Supabase bucket

//     const { data, error } = await this.supabase.storage
//       .from(bucketName)
//       .upload(fileName, file.buffer, {
//         contentType: file.mimetype,
//         upsert: false, // Prevents overwriting if file exists
//       });

//     if (error) {
//       throw new Error(`Upload failed: ${error.message}`);
//     }

//     // Retrieve the public URL
//     const { data: publicUrlData } = this.supabase.storage
//       .from(bucketName)
//       .getPublicUrl(fileName);

//     return {
//       message: 'File uploaded successfully',
//       url: publicUrlData.publicUrl,
//     };
//   }
// }
