import { Module } from '@nestjs/common';
import { ColorController } from './color.controller';
import { ColorService } from './color.service';
import { DrizzleModule } from 'src/database/database.module';

@Module({
  imports: [DrizzleModule],
  controllers: [ColorController],
  providers: [ColorService],
  exports: [ColorService],
})
export class ColorModule {}
