import { Module } from '@nestjs/common';
import { SizeController } from './size.controller';
import { SizeService } from './size.service';
import { DrizzleModule } from 'src/database/database.module';

@Module({
  imports: [DrizzleModule],
  controllers: [SizeController],
  providers: [SizeService],
  exports: [SizeService],
})
export class SizeModule {}
