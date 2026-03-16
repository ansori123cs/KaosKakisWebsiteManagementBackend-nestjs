import { Global, Module } from '@nestjs/common';
import { UploadService } from './upload.service';

@Global()
@Module({
  exports: [UploadService],
  providers: [UploadService],
})
export class UploadModule {}
