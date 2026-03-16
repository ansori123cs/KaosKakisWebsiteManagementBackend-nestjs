import { Module } from '@nestjs/common';
import { DrizzleModule } from 'src/database/database.module';
import { SockController } from './sock.controller';
import { SockService } from './sock.service';
import { UploadModule } from 'src/shared/upload/uppload.module';

@Module({
  imports: [DrizzleModule, UploadModule],
  controllers: [SockController],
  providers: [SockService],
  exports: [SockService],
})
export class SockModule {}
