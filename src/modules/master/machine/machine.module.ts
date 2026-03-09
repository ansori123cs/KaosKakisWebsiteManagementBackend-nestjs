import { Module } from '@nestjs/common';
import { MachineController } from './machine.controller';
import { MachineService } from './machine.service';
import { DrizzleModule } from 'src/database/database.module';

@Module({
  imports: [DrizzleModule],
  controllers: [MachineController],
  providers: [MachineService],
  exports: [MachineService],
})
export class MachineModule {}
