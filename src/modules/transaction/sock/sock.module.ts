import { Module } from '@nestjs/common';
import { DrizzleModule } from 'src/database/database.module';
import { SockController } from './sock.controller';
import { SockService } from './sock.service';

@Module({
  imports: [DrizzleModule],
  controllers: [SockController],
  providers: [SockService],
  exports: [SockService],
})
export class SockModule {}
